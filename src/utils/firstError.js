import { parseError } from "./parseError";

export function getFirstRelevantError(...errors) {
    for (const err of errors) {
      const parsed = parseError(err);
      if (parsed.type !== "none") {
        return parsed;
      }
    }
    return { type: "none" };
  }
  