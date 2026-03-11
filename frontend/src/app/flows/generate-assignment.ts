export interface AssignmentQuestion {
  id: string;
  prompt: string;
}

export interface AssignmentPayload {
  knowledgePoints: string[];
  goalLevel: string;
}

export function mapAssignmentPayload(input: AssignmentPayload): AssignmentQuestion[] {
  return input.knowledgePoints.slice(0, 5).map((point, idx) => ({
    id: `q-${idx + 1}`,
    prompt: `Use the word "${point}" in a ${input.goalLevel.toLowerCase()} sentence.`
  }));
}
