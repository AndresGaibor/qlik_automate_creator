export interface EnlacesPaginacionQlik {
  next?: { href?: string | null };
  prev?: { href?: string | null };
}

export interface EspacioQlik {
  id: string;
  name: string;
  type: "shared" | "managed" | "data" | string;
  ownerId?: string;
  tenantId?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  meta?: {
    roles?: string[];
    actions?: string[];
    assignableRoles?: string[];
  };
}

export interface FlujoQlik {
  id: string;
  name: string;
  spaceId?: string;
  owner?: { id: string; name: string };
  ownerId?: string;
  createdDate?: string;
  modifiedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  artifact?: { id: string; name: string };
}

export type EstadoEjecucionQlik =
  | "failed"
  | "finished"
  | "finished with warnings"
  | "must stop"
  | "not started"
  | "running"
  | "starting"
  | "stopped"
  | "exceeded limit"
  | "queued"
  | string;

/** Alias temporal para consumidores existentes. */
export type EstadoEjecucion = EstadoEjecucionQlik;

export interface EjecucionQlik {
  id: string;
  automationId?: string;
  title?: string;
  status: EstadoEjecucionQlik;
  context?: string;
  ownerId?: string;
  spaceId?: string;
  executedById?: string;
  startTime?: string;
  stopTime?: string;
  createdAt?: string;
  updatedAt?: string;
  error?: unknown[] | string;
  billable?: boolean;
}

export interface AutomatizacionQlik {
  id: string;
  name: string;
  state?: "available" | "unavailable" | "disabled" | string;
  runMode?: "manual" | "scheduled" | "triggered" | "webhook" | string;
  ownerId?: string;
  spaceId?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  lastRunAt?: string;
  lastRunStatus?: string;
  lastRun?: EjecucionQlik;
  schedules?: Array<Record<string, unknown>>;
  workspace?: Record<string, unknown>;
  maxConcurrentRuns?: number;
  connectorIds?: string[];
  endpointIds?: string[];

  /** Compatibilidad con respuestas antiguas o pruebas existentes. */
  owner?: { id: string; name: string };
  isEnabled?: boolean;
  triggerType?: string;
  lastExecution?: EjecucionQlik;
  createdDate?: string;
  modifiedDate?: string;
}

export interface UsuarioQlik {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  status?: string;
  tenantId?: string;
  picture?: string;
  roles?: string[];
}

export interface ConectorAutomatizacionQlik {
  id: string;
  name: string;
  billable?: boolean;
  logoLarge?: string;
  logoMedium?: string;
  logoSmall?: string;
  description?: string;
  hasWebhooks?: boolean;
}

export interface ConexionAutomatizacionQlik {
  id: string;
  name: string;
  ownerId?: string;
  spaceId?: string;
  connectorId: string;
  isConnected?: boolean;
  createdAt?: string;
  updatedAt?: string;
  params?: Array<Record<string, unknown>>;
}
