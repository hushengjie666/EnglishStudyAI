export type Route = "entry" | "home" | "assessment" | "session" | "assignment" | "plan";

export function isRoute(value: string): value is Route {
  return ["entry", "home", "assessment", "session", "assignment", "plan"].includes(value);
}
