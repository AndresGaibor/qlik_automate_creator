import type { EntradaSetup } from "./api";
import { SCOPES_OAUTH_PREDETERMINADOS } from "./scopes-oauth";

export const PASOS_SETUP = [
  { numero: 1, titulo: "Organización", descripcion: "Identificación" },
  { numero: 2, titulo: "Qlik Cloud", descripcion: "Credenciales OAuth" },
  { numero: 3, titulo: "Administrador", descripcion: "Acceso inicial" },
] as const;

export type PasoSetup = (typeof PASOS_SETUP)[number]["numero"];

export interface FormularioSetup {
  organizacionNombre: string;
  qlikTenantHost: string;
  qlikClientId: string;
  qlikClientSecret: string;
  qlikScopes: string[];
  superadminNombre: string;
  superadminCorreo: string;
  qlikRedirectUri: string;
}

export type ActualizarCampoSetup = <K extends keyof FormularioSetup>(
  campo: K,
  valor: FormularioSetup[K],
) => void;

export function calcularRedirectUriSetup(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000/api/auth/qlik/callback";
  }
  return new URL("/api/auth/qlik/callback", window.location.origin).toString();
}

export function crearEstadoInicialSetup(
  redirectUri = calcularRedirectUriSetup(),
): FormularioSetup {
  return {
    organizacionNombre: "",
    qlikTenantHost: "",
    qlikClientId: "",
    qlikClientSecret: "",
    qlikScopes: [...SCOPES_OAUTH_PREDETERMINADOS],
    superadminNombre: "",
    superadminCorreo: "",
    qlikRedirectUri: redirectUri,
  };
}

export function validarPasoSetup(
  paso: PasoSetup,
  formulario: FormularioSetup,
): string | null {
  if (paso === 1) {
    return formulario.organizacionNombre.trim().length < 2
      ? "El nombre de la organización debe tener al menos 2 caracteres."
      : null;
  }
  if (paso === 2) return validarQlik(formulario);
  if (formulario.superadminNombre.trim().length < 2) {
    return "El nombre del administrador debe tener al menos 2 caracteres.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.superadminCorreo)) {
    return "El correo electrónico del administrador no es válido.";
  }
  return null;
}

function validarQlik(formulario: FormularioSetup): string | null {
  if (!formulario.qlikTenantHost.trim()) {
    return "La dirección del tenant de Qlik Cloud es obligatoria.";
  }
  if (!formulario.qlikClientId.trim()) {
    return "El Client ID de OAuth es obligatorio.";
  }
  if (!formulario.qlikClientSecret.trim()) {
    return "El Client Secret de OAuth es obligatorio.";
  }
  if (formulario.qlikScopes.length === 0) {
    return "Debes configurar al menos un scope de OAuth.";
  }
  return null;
}

export function crearEntradaSetup(
  formulario: FormularioSetup,
  frontendUrl: string,
): EntradaSetup {
  return {
    organizacionNombre: formulario.organizacionNombre.trim(),
    qlikTenantHost: formulario.qlikTenantHost.trim(),
    qlikClientId: formulario.qlikClientId.trim(),
    qlikClientSecret: formulario.qlikClientSecret.trim(),
    qlikScopes: formulario.qlikScopes,
    superadminNombre: formulario.superadminNombre.trim(),
    superadminCorreo: formulario.superadminCorreo.trim().toLowerCase(),
    frontendUrl,
  };
}
