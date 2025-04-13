import { getFirstRelevantError } from "./firstError";
import { parseError } from "./parseError";

export function useErrorChecker(...errors) {
  const parsedErrors = errors.map((err) => parseError(err));
  const relevantError = getFirstRelevantError(...parsedErrors);

  return relevantError; 
}
