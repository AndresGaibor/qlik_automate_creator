export interface EspacioQlik {
  id: string;
  name: string;
  type: "shared" | "personal" | "data";
  owner: { id: string; name: string };
  createdDate: string;
  modifiedDate: string;
}

export interface FlujoQlik {
  id: string;
  name: string;
  spaceId?: string;
  owner: { id: string; name: string };
  createdDate: string;
  modifiedDate: string;
  artifact: {
    id: string;
    name: string;
  };
}

/**
 * Schema real de Qlik Automations API.
 * Soporta ambos shapes: el real (state/runMode/ownerId/createdAt/updatedAt/lastRun)
 * y el legacy (isEnabled/triggerType/owner.name/createdDate/modifiedDate/lastExecution).
 */
export interface AutomatizacionQlik {
  id: string;
  name: string;
  spaceId?: string;

  // ── Schema real Qlik ──────────────────────────────────────────────
  state?: "available" | "disabled" | string;
  runMode?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastRun?: {
    id: string;
    status: string;
    startTime: string;
    endTime?: string;
  };
  lastRunStatus?: string;
  lastRunAt?: string;

  // ── Compatibilidad legacy (shape viejo) ───────────────────────────
  owner?: { id: string; name: string };
  isEnabled?: boolean;
  triggerType?: string;
  lastExecution?: {
    id: string;
    status: string;
    startTime: string;
    endTime?: string;
  };
  createdDate?: string;
  modifiedDate?: string;
}

export interface UsuarioQlik {
  id: string;
  name: string;
  /** Email del usuario (opcional, disponible vía fields) */
  email?: string;
  /** Subject/token del usuario (opcional, fallback cuando name/email no están disponibles) */
  subject?: string;
}

export type EstadoEjecucion =
  | "started"
  | "running"
  | "queued"
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

export interface EjecucionQlik {
  id: string;
  automationId: string;
  status: EstadoEjecucion;
  startTime: string;
  /** Fin de la ejecución — Qlik usa stopTime en runs */
  endTime?: string;
  stopTime?: string;
  error?: string;
}
