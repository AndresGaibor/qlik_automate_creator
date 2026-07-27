import { describe, expect, it } from "vitest";
import { SCOPES_OAUTH_PREDETERMINADOS } from "./scopes-oauth";

describe("SCOPES_OAUTH_PREDETERMINADOS", () => {
  it("coincide con los scopes predeterminados del cliente OAuth del backend", () => {
    expect(SCOPES_OAUTH_PREDETERMINADOS).toEqual([
      "user_default",
      "offline_access",
      "identity.name:read",
      "identity.email:read",
      "identity.subject:read",
      "identity.picture:read",
      "automations",
      "automations.private",
      "automations.shared",
      "spaces:read",
      "apps:read",
      "data-integration",
    ]);
  });
});
