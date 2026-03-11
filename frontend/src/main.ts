import "./style.css";
import { generateAssessmentQuiz, scoreAssessmentQuiz, type AssessmentQuestion } from "./app/flows/generate-assessment-quiz";
import { evaluateSessionMasteryHeuristic, evaluateSessionMasteryWithAi } from "./app/flows/evaluate-session-mastery";
import { generateSessionLessons, type SessionLesson } from "./app/flows/generate-session-lessons";
import { buildInitialPlan, buildInitialPlanWithAi, type GeneratedPlan } from "./app/flows/generate-initial-plan";
import { mapAssignmentPayload, type AssignmentQuestion } from "./app/flows/generate-assignment";
import { updatePlanFromSession } from "./app/flows/update-plan-from-session";
import { ERROR_PROMPTS } from "./app/services/error-prompts";
import { loadDynamicDomainGoalBundle, loadDynamicGoalLevelsByDomain } from "./app/services/dynamic-learning-options";
import { getAiProviderConfig } from "./app/services/ai-provider";
import { applyAdaptiveLearning, getRecommendedSessionFocusWords } from "./app/services/adaptive-learning";
import { DEFAULT_GOAL_LEVELS, DEFAULT_POPULAR_DOMAINS, resolveDomain, isValidGoalLevel, type GoalLevelOption } from "./app/state/learning-options";
import { createAssignmentRecord, clearAssignmentRecord, submitAssignmentRecord, type AssignmentRecord } from "./app/state/assignment-store";
import { addPlanHistory, clearPlanHistory, type PlanHistoryEntry } from "./app/state/plan-history";
import { persistCoreState, restoreCoreState, type PersistedCoreState } from "./app/state/persistence";
import { isRoute, type Route } from "./app/routes";
import { evaluateAssignment } from "./components/assignment-result-card";
import { renderAssignmentRequestButton } from "./components/request-assignment-button";
import { renderAssessmentPage } from "./pages/assessment-page";
import { renderAssignmentPage } from "./pages/assignment-page";
import { renderHomePage } from "./pages/home-page";
import { renderPlanPage } from "./pages/plan-page";
import { renderSessionPage } from "./pages/session-page";

interface UiState extends PersistedCoreState {
  errorMessage: string;
  planVersion: number;
  adjustmentReason: string;
  weaknessTags: string[];
  history: PlanHistoryEntry[];
  assignmentQuestions: AssignmentQuestion[];
  assignmentResult: string;
  assignmentRecord: AssignmentRecord | null;
  assessmentQuestions: AssessmentQuestion[];
  sessionLessons: SessionLesson[];
  sessionAnswers: Record<string, string>;
  sessionDiagnosis: string;
  sessionLoading: boolean;
  sessionEvaluating: boolean;
  domainOptions: string[];
  domainGoalMap: Record<string, GoalLevelOption[]>;
  goalOptions: GoalLevelOption[];
  goalSource: "智能" | "缓存" | "兜底";
  optionsLoading: boolean;
}

const ROUTE_FLOW: Route[] = ["entry", "home", "assessment", "plan", "session", "assignment"];

function findPrevRoute(route: Route): Route | null {
  const idx = ROUTE_FLOW.indexOf(route);
  if (idx <= 0) {
    return null;
  }
  return ROUTE_FLOW[idx - 1] ?? null;
}

function findNextRoute(route: Route): Route | null {
  const idx = ROUTE_FLOW.indexOf(route);
  if (idx < 0 || idx >= ROUTE_FLOW.length - 1) {
    return null;
  }
  return ROUTE_FLOW[idx + 1] ?? null;
}

function routeLabel(route: Route): string {
  if (route === "entry") return "入口";
  if (route === "home") return "学习设置";
  if (route === "assessment") return "词汇短测";
  if (route === "plan") return "学习计划";
  if (route === "session") return "学习记录";
  return "课堂作业";
}

function renderQuickNav(route: Route): string {
  const prev = findPrevRoute(route);
  const next = findNextRoute(route);
  return `
    <nav class="quick-nav" data-testid="quick-nav">
      <button id="quick-prev" type="button" ${prev ? "" : "disabled"}>返回上一步</button>
      <span class="quick-nav-label">当前：${routeLabel(route)}</span>
      <button id="quick-next" type="button" ${next ? "" : "disabled"}>前进一步</button>
    </nav>
  `;
}

function normalizeRestoredState(restored: PersistedCoreState): PersistedCoreState {
  if (restored.route === "assignment") {
    return { ...restored, route: restored.planSummary ? "plan" : "home" };
  }

  if ((restored.route === "plan" || restored.route === "session") && !restored.planSummary) {
    return { ...restored, route: "home" };
  }

  if (restored.route === "assessment" && !restored.goalLevel) {
    return { ...restored, route: "home" };
  }

  return restored;
}

function initialState(): UiState {
  const restored = restoreCoreState();
  if (restored) {
    const normalized = normalizeRestoredState(restored);
    return {
      ...normalized,
      errorMessage: "",
      planVersion: 1,
      adjustmentReason: "初始学习计划已生成。",
      weaknessTags: [],
      history: [],
      assignmentQuestions: [],
      assignmentResult: "",
      assignmentRecord: null,
      assessmentQuestions: [],
      sessionLessons: [],
      sessionAnswers: {},
      sessionDiagnosis: "",
      sessionLoading: false,
      sessionEvaluating: false,
      domainOptions: [...DEFAULT_POPULAR_DOMAINS],
      domainGoalMap: {},
      goalOptions: [...DEFAULT_GOAL_LEVELS],
      goalSource: "兜底",
      optionsLoading: false
    };
  }

  return {
    route: "entry",
    selectedDomain: DEFAULT_POPULAR_DOMAINS[0],
    customDomain: "",
    goalLevel: "",
    assessmentScore: 60,
    planSummary: "",
    planLevel: "",
    focusWords: [],
    errorMessage: "",
    planVersion: 1,
    adjustmentReason: "初始学习计划已生成。",
    weaknessTags: [],
    history: [],
    assignmentQuestions: [],
    assignmentResult: "",
    assignmentRecord: null,
    assessmentQuestions: [],
    sessionLessons: [],
    sessionAnswers: {},
    sessionDiagnosis: "",
    sessionLoading: false,
    sessionEvaluating: false,
    domainOptions: [...DEFAULT_POPULAR_DOMAINS],
    domainGoalMap: {},
    goalOptions: [...DEFAULT_GOAL_LEVELS],
    goalSource: "兜底",
    optionsLoading: false
  };
}

function render(state: UiState, target: HTMLElement): void {
  let content = "";

  if (state.route === "entry") {
    content = `
      <section class="panel" data-testid="entry-page">
        <h2>欢迎使用</h2>
        <p>进入学习空间，开始你的个性化英语进阶。</p>
        <button id="enter-workspace" type="button">进入学习空间</button>
      </section>
    `;
  } else if (state.route === "home") {
    content = renderHomePage(
      state.selectedDomain,
      state.customDomain,
      state.goalLevel,
      state.domainOptions,
      state.goalOptions,
      state.goalSource,
      state.optionsLoading,
      state.errorMessage
    );
  } else if (state.route === "assessment") {
    content = renderAssessmentPage(state.assessmentQuestions, state.errorMessage);
  } else if (state.route === "session") {
    content = renderSessionPage(
      state.sessionLessons,
      state.sessionAnswers,
      state.sessionDiagnosis,
      state.sessionLoading,
      state.sessionEvaluating,
      state.errorMessage
    );
  } else if (state.route === "assignment") {
    content = renderAssignmentPage(state.assignmentQuestions, state.errorMessage);
  } else {
    content = `
      ${renderPlanPage(
        state.planSummary,
        state.planLevel,
        state.focusWords,
        state.planVersion,
        state.adjustmentReason,
        state.weaknessTags
      )}
      <section class="panel" data-testid="assignment-result-panel">
        ${renderAssignmentRequestButton()}
        ${state.assignmentResult ? `<p id="assignment-result">${state.assignmentResult}</p>` : ""}
      </section>
    `;
  }

  target.innerHTML = `
    <main class="app-shell" data-testid="app-shell">
      <header class="hero">
        <h1>EnglishStudyAI</h1>
        <p>面向职场人士的 AI 英语词汇私教。</p>
      </header>
      ${renderQuickNav(state.route)}
      ${content}
    </main>
  `;
}

function persist(state: UiState): void {
  persistCoreState({
    route: state.route,
    selectedDomain: state.selectedDomain,
    customDomain: state.customDomain,
    goalLevel: state.goalLevel,
    assessmentScore: state.assessmentScore,
    planSummary: state.planSummary,
    planLevel: state.planLevel,
    focusWords: state.focusWords
  });
}

function toGeneratedPlan(state: UiState): GeneratedPlan {
  return {
    level: state.planLevel,
    summary: state.planSummary,
    focusWords: state.focusWords
  };
}

function ensureAssessmentQuestions(state: UiState): void {
  if (state.assessmentQuestions.length > 0) {
    return;
  }

  const domain = resolveDomain(state.selectedDomain, state.customDomain);
  if (!domain) {
    return;
  }

  state.assessmentQuestions = generateAssessmentQuiz(domain);
}

export function bootstrapApp(target: HTMLElement): UiState {
  const state = initialState();
  let optionsLoading = false;
  let goalOptionsLoading = false;
  let goalOptionsRequestId = 0;
  let homeOptionsTouched = false;
  let bundleSource: "ai" | "cache" | "fallback" = "fallback";

  const rerender = () => {
    render(state, target);
    persist(state);
  };

  const syncOptionsLoading = () => {
    state.optionsLoading = optionsLoading || goalOptionsLoading;
  };

  const toSourceLabel = (source: "ai" | "cache" | "fallback"): "智能" | "缓存" | "兜底" => {
    if (source === "ai") {
      return "智能";
    }
    if (source === "cache") {
      return "缓存";
    }
    return "兜底";
  };

  const matchDomainGoalsFromMap = (domain: string): GoalLevelOption[] | null => {
    const normalized = domain.trim().toLowerCase();
    if (!normalized) {
      return null;
    }

    for (const [key, goals] of Object.entries(state.domainGoalMap)) {
      if (key.trim().toLowerCase() === normalized) {
        return goals;
      }
    }
    return null;
  };

  const applyGoalOptionsForDomain = (domain: string, source: "ai" | "cache" | "fallback") => {
    const mappedGoals = matchDomainGoalsFromMap(domain);
    if (mappedGoals && mappedGoals.length > 0) {
      state.goalOptions = mappedGoals;
      state.goalSource = toSourceLabel(source);
    } else {
      state.goalSource = "兜底";
    }

    if (!isValidGoalLevel(state.goalLevel, state.goalOptions)) {
      state.goalLevel = "";
    }
  };

  const refreshGoalOptionsForDomain = async (domain: string) => {
    const requestId = ++goalOptionsRequestId;
    goalOptionsLoading = true;
    syncOptionsLoading();
    if (state.route === "home") {
      rerender();
    }

    const result = await loadDynamicGoalLevelsByDomain(domain);
    if (requestId !== goalOptionsRequestId) {
      return;
    }

    state.goalOptions = result.goalLevels;
    state.goalSource = toSourceLabel(result.source);
    if (!isValidGoalLevel(state.goalLevel, state.goalOptions)) {
      state.goalLevel = "";
    }

    goalOptionsLoading = false;
    syncOptionsLoading();
    if (state.route === "home") {
      rerender();
    } else {
      persist(state);
    }
  };

  const refreshLearningOptions = async () => {
    if (optionsLoading) {
      return;
    }

    optionsLoading = true;
    syncOptionsLoading();
    if (state.route === "home") {
      rerender();
    }

    const result = await loadDynamicDomainGoalBundle();
    bundleSource = result.source;
    state.domainOptions = result.domains;
    state.domainGoalMap = result.domainGoals;

    if (!homeOptionsTouched && !state.customDomain && !state.domainOptions.includes(state.selectedDomain)) {
      state.selectedDomain = state.domainOptions[0] ?? "";
    }

    const activeDomain = resolveDomain(state.selectedDomain, state.customDomain);
    applyGoalOptionsForDomain(activeDomain, bundleSource);

    optionsLoading = false;
    syncOptionsLoading();

    if (state.route === "home") {
      rerender();
    } else {
      persist(state);
    }
  };

  const prepareSessionLessons = async () => {
    if (state.sessionLoading) {
      return;
    }

    state.sessionLoading = true;
    state.sessionAnswers = {};
    state.errorMessage = "";
    rerender();

    const domain = resolveDomain(state.selectedDomain, state.customDomain);
    const adaptiveFocusWords = getRecommendedSessionFocusWords(state.focusWords);
    state.sessionDiagnosis =
      adaptiveFocusWords.length > 0 && adaptiveFocusWords[0] !== (state.focusWords[0] ?? "")
        ? "系统已自动加入到期复习词，并按掌握情况调整本节顺序。"
        : "";
    const lessons = await generateSessionLessons({
      domain: domain || "通用",
      goalLevel: state.goalLevel,
      focusWords: adaptiveFocusWords.length > 0 ? adaptiveFocusWords : state.focusWords
    });

    state.sessionLessons = lessons;
    state.sessionLoading = false;
    rerender();
  };

  const navigateToRoute = (targetRoute: Route) => {
    if (targetRoute === "assessment") {
      const domain = resolveDomain(state.selectedDomain, state.customDomain);
      if (!domain || !isValidGoalLevel(state.goalLevel, state.goalOptions)) {
        state.route = "home";
        state.errorMessage = !domain ? ERROR_PROMPTS.MISSING_DOMAIN : ERROR_PROMPTS.MISSING_GOAL;
        rerender();
        return;
      }

      ensureAssessmentQuestions(state);
      state.route = "assessment";
      state.errorMessage = "";
      rerender();
      return;
    }

    if (targetRoute === "plan" && !state.planSummary) {
      state.route = "home";
      state.errorMessage = "请先完成词汇短测并生成学习计划。";
      rerender();
      return;
    }

    if (targetRoute === "session" && !state.planSummary) {
      state.route = "home";
      state.errorMessage = "请先生成学习计划，再进入学习记录。";
      rerender();
      return;
    }

    if (targetRoute === "session") {
      state.route = "session";
      state.errorMessage = "";
      rerender();
      void prepareSessionLessons();
      return;
    }

    if (targetRoute === "assignment" && state.focusWords.length === 0) {
      state.route = "home";
      state.errorMessage = "请先完成学习计划，再进入课堂作业。";
      rerender();
      return;
    }

    if (targetRoute === "assignment" && state.assignmentQuestions.length === 0) {
      state.assignmentQuestions = mapAssignmentPayload({
        knowledgePoints: state.focusWords,
        goalLevel: state.goalLevel || "READING"
      });
      state.assignmentRecord = createAssignmentRecord(`assignment-${Date.now()}`, state.assignmentQuestions);
    }

    state.route = targetRoute;
    state.errorMessage = "";
    rerender();
  };

  if (state.route === "assessment") {
    ensureAssessmentQuestions(state);
  }
  rerender();
  void refreshLearningOptions();

  target.addEventListener("click", (event) => {
    const el = event.target as HTMLElement;

    if (el.id === "quick-prev") {
      const prev = findPrevRoute(state.route);
      if (prev) {
        navigateToRoute(prev);
      }
      return;
    }

    if (el.id === "quick-next") {
      const next = findNextRoute(state.route);
      if (next) {
        navigateToRoute(next);
      }
      return;
    }

    if (el.id === "enter-workspace") {
      state.route = "home";
      state.errorMessage = "";
      rerender();
      void refreshLearningOptions();
      return;
    }

    if (el.id === "go-assessment") {
      const selected = target.querySelector<HTMLSelectElement>("#domain-select")?.value ?? "";
      const custom = target.querySelector<HTMLInputElement>("#custom-domain")?.value ?? "";
      const goal = target.querySelector<HTMLSelectElement>("#goal-level")?.value ?? "";
      const domain = resolveDomain(selected, custom);

      if (!domain) {
        state.errorMessage = ERROR_PROMPTS.MISSING_DOMAIN;
        rerender();
        return;
      }

      if (!isValidGoalLevel(goal, state.goalOptions)) {
        state.errorMessage = ERROR_PROMPTS.MISSING_GOAL;
        rerender();
        return;
      }

      state.selectedDomain = selected;
      state.customDomain = custom;
      state.goalLevel = goal;
      state.assessmentQuestions = generateAssessmentQuiz(domain);
      state.route = "assessment";
      state.errorMessage = "";
      rerender();
      return;
    }

    if (el.id === "submit-assessment") {
      if (state.assessmentQuestions.length === 0) {
        ensureAssessmentQuestions(state);
        state.errorMessage = "已重新生成测评题，请先完成作答。";
        rerender();
        return;
      }

      const answers = state.assessmentQuestions.map((question) => {
        const selected = target.querySelector<HTMLInputElement>(`input[name="assessment-${question.id}"]:checked`);
        return selected ? Number(selected.value) : -1;
      });

      if (answers.some((value) => value < 0)) {
        state.errorMessage = ERROR_PROMPTS.MISSING_ASSESSMENT_ANSWER;
        rerender();
        return;
      }

      const score = scoreAssessmentQuiz(state.assessmentQuestions, answers);

      if (!isValidGoalLevel(state.goalLevel, state.goalOptions)) {
        state.errorMessage = ERROR_PROMPTS.MISSING_GOAL;
        state.route = "home";
        rerender();
        return;
      }

      const domain = resolveDomain(state.selectedDomain, state.customDomain);
      const applyPlan = (plan: GeneratedPlan) => {
        state.assessmentScore = score;
        state.planSummary = plan.summary;
        state.planLevel = plan.level;
        state.focusWords = plan.focusWords;
        state.planVersion = 1;
        state.adjustmentReason = "初始学习计划已生成。";
        state.weaknessTags = [];
        state.assignmentQuestions = [];
        state.assignmentResult = "";
        state.assignmentRecord = null;
        state.assessmentQuestions = [];
        clearAssignmentRecord();
        clearPlanHistory();
        state.route = "plan";
        state.errorMessage = "";
        rerender();
      };

      const aiConfig = getAiProviderConfig();
      if (!aiConfig.apiKey || !aiConfig.baseUrl || !aiConfig.endpoint || !aiConfig.model) {
        const plan = buildInitialPlan({
          domain,
          goalLevel: state.goalLevel,
          score
        });
        applyPlan(plan);
        return;
      }

      state.errorMessage = "智能系统正在生成学习计划，请稍候...";
      rerender();

      void (async () => {
        const plan = await buildInitialPlanWithAi({
          domain,
          goalLevel: state.goalLevel,
          score
        });
        applyPlan(plan);
      })();
      return;
    }

    if (el.id === "start-session") {
      state.route = "session";
      state.errorMessage = "";
      rerender();
      void prepareSessionLessons();
      return;
    }

    if (el.id === "submit-session") {
      const domAnswers = Array.from(target.querySelectorAll<HTMLTextAreaElement>(".lesson-answer")).reduce<Record<string, string>>((acc, node) => {
        const id = node.getAttribute("data-lesson-id") ?? "";
        if (id) {
          acc[id] = node.value.trim();
        }
        return acc;
      }, {});
      const answers = { ...domAnswers, ...state.sessionAnswers };

      const answeredCount = Object.values(answers).filter((value) => value.length > 0).length;
      if (answeredCount === 0) {
        state.errorMessage = "请先完成至少 1 个知识点回答，系统才能判断掌握情况。";
        rerender();
        return;
      }

      const applyMasteryResult = (
        masteredWords: string[],
        missedWords: string[],
        diagnosis: string,
        evaluations: Array<{ word: string; score: number; band: "mastered" | "review" | "relearn" }>
      ) => {
        const adaptive = applyAdaptiveLearning(evaluations, state.focusWords);
        state.sessionDiagnosis = `${diagnosis} ${adaptive.reviewSummary}`.trim();

        const updated = updatePlanFromSession(
          toGeneratedPlan(state),
          {
            masteredWords,
            missedWords,
            recommendedFocusWords: adaptive.recommendedFocusWords,
            adaptiveSummary: adaptive.reviewSummary
          },
          state.planVersion
        );
        state.planSummary = updated.summary;
        state.planLevel = updated.level;
        state.focusWords = updated.focusWords;
        state.planVersion = updated.version;
        state.adjustmentReason = updated.adjustmentReason;
        state.weaknessTags = updated.weaknessTags;
        state.history = addPlanHistory(updated);
        state.sessionEvaluating = false;
        state.route = "plan";
        state.errorMessage = "";
        rerender();
      };

      const domain = resolveDomain(state.selectedDomain, state.customDomain);
      const aiConfig = getAiProviderConfig();
      if (!aiConfig.apiKey || !aiConfig.baseUrl || !aiConfig.endpoint || !aiConfig.model) {
        const result = evaluateSessionMasteryHeuristic(state.sessionLessons, answers);
        applyMasteryResult(result.masteredWords, result.missedWords, result.diagnosis, result.evaluations);
        return;
      }

      state.sessionEvaluating = true;
      state.errorMessage = "智能系统正在判断掌握情况，请稍候...";
      rerender();

      void (async () => {
        const result = await evaluateSessionMasteryWithAi(domain, state.sessionLessons, answers);
        applyMasteryResult(result.masteredWords, result.missedWords, result.diagnosis, result.evaluations);
      })();
      return;
    }

    if (el.id === "request-assignment") {
      state.assignmentQuestions = mapAssignmentPayload({
        knowledgePoints: state.focusWords,
        goalLevel: state.goalLevel || "READING"
      });
      state.assignmentRecord = createAssignmentRecord(`assignment-${Date.now()}`, state.assignmentQuestions);
      state.route = "assignment";
      state.errorMessage = "";
      rerender();
      return;
    }

    if (el.id === "back-to-plan") {
      state.route = "plan";
      state.errorMessage = "";
      rerender();
      return;
    }

    if (el.id === "submit-assignment") {
      if (!state.assignmentRecord) {
        state.errorMessage = ERROR_PROMPTS.MISSING_ASSIGNMENT;
        rerender();
        return;
      }

      const answers = Array.from(target.querySelectorAll<HTMLInputElement>(".assignment-answer")).map((input) => input.value.trim());
      const correct = answers.filter((ans) => ans.length > 0).length;
      const result = evaluateAssignment(answers.length, correct);
      submitAssignmentRecord(result);
      state.assignmentResult = `得分：${result.score}。${result.feedback}`;
      state.route = "plan";
      state.errorMessage = "";
      rerender();
      return;
    }

    if (el.id === "reset-flow") {
      state.route = "entry";
      state.errorMessage = "";
      state.planVersion = 1;
      state.adjustmentReason = "初始学习计划已生成。";
      state.weaknessTags = [];
      state.history = [];
      state.assignmentQuestions = [];
      state.assignmentResult = "";
      state.assignmentRecord = null;
      state.assessmentQuestions = [];
      state.sessionLessons = [];
      state.sessionAnswers = {};
      state.sessionDiagnosis = "";
      state.sessionLoading = false;
      state.sessionEvaluating = false;
      clearAssignmentRecord();
      clearPlanHistory();
      rerender();
    }
  });

  target.addEventListener("change", (event) => {
    const el = event.target as HTMLElement;

    if (el.id === "domain-select") {
      state.selectedDomain = (el as HTMLSelectElement).value;
      homeOptionsTouched = true;
      state.errorMessage = "";
      const activeDomain = resolveDomain(state.selectedDomain, state.customDomain);
      const mapped = matchDomainGoalsFromMap(activeDomain);
      if (mapped) {
        applyGoalOptionsForDomain(activeDomain, bundleSource);
        rerender();
      } else {
        state.goalLevel = "";
        void refreshGoalOptionsForDomain(activeDomain);
        rerender();
      }
      return;
    }
    if (el.id === "custom-domain") {
      state.customDomain = (el as HTMLInputElement).value;
      homeOptionsTouched = true;
      state.errorMessage = "";
      const activeDomain = resolveDomain(state.selectedDomain, state.customDomain);
      const mapped = matchDomainGoalsFromMap(activeDomain);
      if (mapped) {
        applyGoalOptionsForDomain(activeDomain, bundleSource);
        rerender();
      } else {
        state.goalLevel = "";
        void refreshGoalOptionsForDomain(activeDomain);
        rerender();
      }
      return;
    }
    if (el.id === "goal-level") {
      state.goalLevel = (el as HTMLSelectElement).value;
      homeOptionsTouched = true;
    }
    persist(state);
  });

  target.addEventListener("input", (event) => {
    const el = event.target as HTMLElement;
    if (!(el instanceof HTMLTextAreaElement) || !el.classList.contains("lesson-answer")) {
      return;
    }
    const lessonId = el.getAttribute("data-lesson-id") ?? "";
    if (!lessonId) {
      return;
    }
    state.sessionAnswers = {
      ...state.sessionAnswers,
      [lessonId]: el.value
    };
    persist(state);
  });

  return state;
}

export function renderApp(target: HTMLElement): void {
  bootstrapApp(target);
}

export function restoreRoute(value: string): Route {
  if (isRoute(value)) {
    return value;
  }
  return "entry";
}

const root = document.querySelector<HTMLElement>("#app");
if (root) {
  renderApp(root);
}
