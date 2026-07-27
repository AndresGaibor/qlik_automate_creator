export interface PuertoConsultaTenantQlik {
  obtenerTenant(tenantQlikId: string): Promise<{
    host: string;
    automatizacionBaseIdQlik?: string | null;
    automatizacionBaseNombre?: string | null;
    destinoApiUrl?: string | null;
    impalaHost?: string | null;
    impalaPort?: number | null;
  } | null>;
}
