import { randomBytes } from "node:crypto";

export function generarUuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return randomBytes(16).toString("hex");
}
