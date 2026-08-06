import type { TenantQlik } from "../api";
import { SeccionConfigurarDestinosTenant } from "./seccion-configurar-destinos-tenant";

export function SetupTecnicoDestinos({
  organizacionId,
  tenantsQlik,
}: {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}) {
  return (
    <div className="space-y-6">
      {tenantsQlik.map((tQlik) => (
        <SeccionConfigurarDestinosTenant
          key={tQlik.id}
          organizacionId={organizacionId}
          tenantQlik={tQlik}
        />
      ))}
    </div>
  );
}
