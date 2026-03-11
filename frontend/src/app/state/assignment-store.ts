import type { AssignmentQuestion } from "../flows/generate-assignment";
import type { AssignmentResult } from "../../components/assignment-result-card";

export interface AssignmentRecord {
  id: string;
  questions: AssignmentQuestion[];
  submitted: boolean;
  result: AssignmentResult | null;
}

let current: AssignmentRecord | null = null;

export function createAssignmentRecord(id: string, questions: AssignmentQuestion[]): AssignmentRecord {
  current = {
    id,
    questions,
    submitted: false,
    result: null
  };

  return current;
}

export function submitAssignmentRecord(result: AssignmentResult): AssignmentRecord | null {
  if (!current) {
    return null;
  }

  current = {
    ...current,
    submitted: true,
    result
  };

  return current;
}

export function getAssignmentRecord(): AssignmentRecord | null {
  return current;
}

export function clearAssignmentRecord(): void {
  current = null;
}
