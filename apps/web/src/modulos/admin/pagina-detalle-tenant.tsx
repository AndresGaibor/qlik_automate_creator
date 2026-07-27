import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  type DetalleTenant,
  obtenerDetalleTenant,
  obtenerTenantsQlik,
} from "./api";
import type { TenantQlik } from "./api";
import { SeccionAutomatizacionBaseTenant } from "./componentes/seccion-automatizacion-base-tenant";
import { SeccionInfoTenant } from "./componentes/seccion-info-tenant";
import { SeccionOauthQlik } from "./componentes/seccion-oauth-qlik";
import { SeccionQlikCloud } from "./componentes/seccion-qlik-cloud";
import { SeccionUsuarios } from "./componentes/seccion-usuarios";
import { useDetalleTenantMutations } from "./hooks/useDetalleTenantMutations";

interface Props {
  tenantId: string;
}

export function PaginaDetalleTenant({ tenantId }: Props) {
  const [modalUsuario, setModalUsuario] = useState(false);
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState<"admin" | "usuario">("usuario");

  const { data: tenant, isLoading } = useQuery<DetalleTenant>({
    queryKey: ["admin-tenant", tenantId],
    queryFn: () => obtenerDetalleTenant(tenantId),
  });

  const { data: tenantsQlik = [] } = useQuery<TenantQlik[]>({
    queryKey: ["admin-tenants-qlik", tenantId],
    queryFn: () => obtenerTenantsQlik(tenantId),
  });

  const {
    actualizar,
    agregarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    crearQlik,
    hacerPrincipal,
    eliminarQlik,
  } = useDetalleTenantMutations({
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
    return <EstadoCarga mensaje="Cargando configuración del entorno..." />;
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
      {/* Breadcrumb + badge de estado */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/admin/tenants"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors font-medium"
        >
          <Icon name="chev" size="sm" className="rotate-180" />
          Organizaciones
        </Link>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            tenant.estado === "activa"
              ? "bg-brand-50 text-brand-700 border border-brand-100"
              : "bg-red-50 text-danger-600 border border-red-100"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              tenant.estado === "activa"
                ? "bg-brand-600 animate-dot-pulse"
                : "bg-danger-600"
            }`}
          />
          {tenant.estado === "activa" ? "Activa" : "Suspendida"}
        </span>
      </div>

      <h1 className="font-display text-2xl font-semibold text-ink-900 tracking-tight mb-6">
        {tenant.nombre}
      </h1>

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

      <SeccionOauthQlik organizacionId={tenantId} tenantsQlik={tenantsQlik} />

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
