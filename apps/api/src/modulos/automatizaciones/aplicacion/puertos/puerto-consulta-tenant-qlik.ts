export interface PuertoConsultaTenantQlik {
  obtenerTenant(tenantQlikId: string): Promise<{
    host: string;
    automatizacionBaseIdQlik?: string | null;
    automatizacionBaseNombre?: string | null;
    automatizacionPlantillaModo1IdQlik?: string | null;
    automatizacionPlantillaModo1Nombre?: string | null;
    automatizacionPlantillaModo2IdQlik?: string | null;
    automatizacionPlantillaModo2Nombre?: string | null;
    destinoApiUrl?: string | null;
    impalaHost?: string | null;
    impalaPort?: number | null;
  } | null>;
}
