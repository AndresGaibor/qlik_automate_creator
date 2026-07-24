import { Button } from "@/compartido/componentes/ui/button";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { type DetalleTenant, obtenerDetalleTenant, obtenerTenantsQlik } from "./api";
import { SeccionAutomatizacionBaseTenant } from "./componentes/seccion-automatizacion-base-tenant";
import { SeccionInfoTenant } from "./componentes/seccion-info-tenant";
import { SeccionQlikCloud } from "./componentes/seccion-qlik-cloud";
import { SeccionUsuarios } from "./componentes/seccion-usuarios";
import { useDetalleTenantMutations } from "./hooks/useDetalleTenantMutations";

interface Props {
  tenantId: string;
}

export function PaginaDetalleTenant({ tenantId }: Props) {
  const navegar = useNavigate();
  const [modalUsuario, setModalUsuario] = useState(false);
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState<"admin" | "usuario">("usuario");

  const { data: tenant, isLoading } = useQuery<DetalleTenant>({
    queryKey: ["admin-tenant", tenantId],
    queryFn: () => obtenerDetalleTenant(tenantId),
  });

  const { data: tenantsQlik = [] } = useQuery({
    queryKey: ["admin-tenants-qlik", tenantId],
    queryFn: () => obtenerTenantsQlik(tenantId),
  });

  const { actualizar, agregarUsuario, actualizarUsuario, eliminarUsuario, crearQlik, hacerPrincipal, eliminarQlik } =
    useDetalleTenantMutations({
      tenantId,
      correoUsuario,
      rolUsuario,
      onLimpiarFormularioUsuario: () => {
        setModalUsuario(false);
        setCorreoUsuario("");
        setRolUsuario("usuario");
      },
    });

  if (isLoading) {
    return <EstadoCarga mensaje="Cargando detalles..." />;
  }

  if (!tenant) {
    return (
      <div className="text-center py-12 text-red-600">
        Organización no encontrada
      </div>
    );
  }

  return (
    <PageLayout>
      <div>
        <Button
          variant="ghost"
          onClick={() => navegar({ to: "/admin/tenants" })}
          className="text-gray-600 hover:text-gray-900 -ml-2 mb-2"
        >
          ← Volver a Organizaciones
        </Button>
      </div>

      <SeccionInfoTenant
        tenant={tenant}
        onActualizarEstado={(estado) => actualizar.mutate({ estado })}
        onActualizarNombre={(nombre) => actualizar.mutate({ nombre })}
        actualizar={actualizar}
      />

      <SeccionQlikCloud
        tenant={{ id: tenant.id }}
        tenantsQlik={tenantsQlik}
        onCrear={(params) => crearQlik.mutate(params)}
        onEliminar={(id) => eliminarQlik.mutate(id)}
        onHacerPrincipal={(id) => hacerPrincipal.mutate(id)}
        crear={crearQlik}
        eliminar={eliminarQlik}
        hacerPrincipal={hacerPrincipal}
      />

      <SeccionAutomatizacionBaseTenant
        organizacionId={tenantId}
        tenantsQlik={tenantsQlik}
      />

      <SeccionUsuarios
        usuarios={tenant.usuarios}
        onActualizarRol={(params) => actualizarUsuario.mutate(params)}
        onEliminarUsuario={(id) => eliminarUsuario.mutate(id)}
        onAbrirModalAgregar={() => setModalUsuario(true)}
        modalAgregar={{
          open: modalUsuario,
          onClose: () => setModalUsuario(false),
          onAgregar: (correo, rol) => {
            setCorreoUsuario(correo);
            setRolUsuario(rol);
            agregarUsuario.mutate();
          },
          isPending: agregarUsuario.isPending,
        }}
        actualizar={actualizarUsuario}
        eliminar={eliminarUsuario}
      />
    </PageLayout>
  );
}
