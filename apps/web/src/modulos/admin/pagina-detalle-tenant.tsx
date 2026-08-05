import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
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
import { SeccionConfigurarImpalaTenant } from "./componentes/seccion-configurar-impala-tenant";
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

      <SeccionConexionImpala
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

function SeccionConexionImpala({
  organizacionId,
  tenantsQlik,
}: {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}) {
  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
          <Icon name="db" className="text-brand-600" />
          Conexión a Impala
        </CardTitle>
        <p className="text-xs text-ink-500 mt-1">
          Configura el servidor Impala donde el sistema escribe las tablas de
          resultados. Incluye método de autenticación y credenciales si las
          requiere.
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {tenantsQlik.map((tQlik, idx) => (
          <div
            key={tQlik.id}
            className="rounded-xl border border-line-200 bg-surface overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-200 bg-app/40 px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-obj-100 text-obj-700 font-bold text-sm">
                  Q{idx + 1}
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-ink-900 text-sm block truncate">
                    {tQlik.nombre || "Entorno Qlik Cloud"}
                  </span>
                  <span className="font-mono text-xs text-ink-500 block truncate">
                    {tQlik.host}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  tQlik.impalaHost
                    ? "bg-brand-50 text-brand-700 border border-brand-100"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    tQlik.impalaHost
                      ? "bg-brand-600"
                      : "bg-amber-500 animate-pulse"
                  }`}
                />
                {tQlik.impalaHost ? "Conectado" : "Sin configurar"}
              </span>
            </div>
            <div className="p-5">
              <SeccionConfigurarImpalaTenant
                organizacionId={organizacionId}
                tenantQlik={tQlik}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
