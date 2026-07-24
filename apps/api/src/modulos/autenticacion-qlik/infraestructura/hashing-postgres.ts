import crypto from "node:crypto";

export function hash(valor: string): string {
  return crypto.createHash("sha256").update(valor).digest("hex");
}
