import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import {
  type ConfiguracionOauthQlik,
  type DetalleTenant,
  type TenantQlik,
  obtenerConfiguracionOauthTenant,
  obtenerDetalleTenant,
  obtenerTenantsQlik,
} from "./api";
import { NavegacionConfiguracion } from "./componentes/navegacion-configuracion";
import { ResumenConfiguracion } from "./componentes/resumen-configuracion";
import { SeccionAutomatizacionBaseTenant } from "./componentes/seccion-automatizacion-base-tenant";
import { SeccionConexionImpala } from "./componentes/seccion-conexion-impala";
import { SeccionEspaciosVisibles } from "./componentes/seccion-espacios-visibles";
import { SeccionInfoTenant } from "./componentes/seccion-info-tenant";
import { SeccionOauthQlik } from "./componentes/seccion-oauth-qlik";
import { SeccionOrigenesDatos } from "./componentes/seccion-origenes-datos";
import { SeccionQlikCloud } from "./componentes/seccion-qlik-cloud";
import { SeccionUsuarios } from "./componentes/seccion-usuarios";
import { useDetalleTenantMutations } from "./hooks/useDetalleTenantMutations";
import { crearResumenConfiguracion } from "./utiles-estado-configuracion";

interface Props {
  tenantId: string;
  modoConfiguracion?: boolean;
}

function EstadoConfiguracion({ tenant }: { tenant: DetalleTenant }) {
  const activa = tenant.estado === "activa";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        activa
          ? "border-brand-100 bg-brand-50 text-brand-700"
          : "border-red-100 bg-red-50 text-danger-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          activa ? "animate-dot-pulse bg-brand-600" : "bg-danger-600"
        }`}
      />
      {activa ? "Activa" : "Suspendida"}
    </span>
  );
}

function SeccionAnclada({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
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

  const tenantQlikPrincipal =
    tenantsQlik.find((item) => item.esPrincipal) ?? tenantsQlik[0];

  const oauthPrincipal = useQuery<ConfiguracionOauthQlik>({
    queryKey: ["admin-oauth-qlik", tenantId, tenantQlikPrincipal?.id],
    queryFn: () =>
      obtenerConfiguracionOauthTenant(tenantId, tenantQlikPrincipal?.id ?? ""),
    enabled: Boolean(tenantQlikPrincipal?.id),
    retry: false,
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
      <div className="py-12 text-center text-danger-600">
        Configuración no encontrada
      </div>
    );
  }

  const resumen = crearResumenConfiguracion({
    empresaActiva: tenant.estado === "activa",
    cantidadUsuarios: tenant.usuarios.length,
    qlik: {
      conectado: tenantQlikPrincipal?.estado === "activo",
      host: tenantQlikPrincipal?.host,
    },
    oauth: { estado: oauthPrincipal.data?.estado },
    plantilla: {
      configurada: Boolean(tenantQlikPrincipal?.automatizacionBaseIdQlik),
      nombre: tenantQlikPrincipal?.automatizacionBaseNombre,
    },
    impala: {
      conectada: Boolean(tenantQlikPrincipal?.impalaHost),
      host: tenantQlikPrincipal?.impalaHost,
    },
  });

  return (
    <PageLayout>
      <PageHeader
        title="Configuración"
        description="Administra la organización, Qlik Cloud, los espacios visibles, el acceso OAuth, la automatización base, Impala, los orígenes de datos y los usuarios autorizados."
        actions={<EstadoConfiguracion tenant={tenant} />}
      />

      <ResumenConfiguracion items={resumen} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <NavegacionConfiguracion items={resumen} />
        </aside>

        <div className="min-w-0 space-y-6">
          <SeccionAnclada id="general">
            <SeccionInfoTenant
              tenant={tenant}
              onActualizarEstado={(estado) => actualizar.mutate({ estado })}
              onActualizarNombre={(nombre) => actualizar.mutate({ nombre })}
              actualizar={actualizar}
            />
          </SeccionAnclada>

          <SeccionAnclada id="qlik">
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
          </SeccionAnclada>

          <SeccionAnclada id="espacios">
            {tenantQlikPrincipal ? (
              <SeccionEspaciosVisibles
                organizacionId={tenantId}
                tenantQlikId={tenantQlikPrincipal.id}
              />
            ) : (
              <div className="rounded-xl border border-line-200 bg-surface p-6 text-sm text-ink-500 shadow-card">
                Conecta primero un entorno Qlik Cloud para configurar los
                espacios visibles.
              </div>
            )}
          </SeccionAnclada>

          <SeccionAnclada id="oauth">
            <SeccionOauthQlik
              organizacionId={tenantId}
              tenantsQlik={tenantsQlik}
            />
          </SeccionAnclada>

          <SeccionAnclada id="plantilla">
            <SeccionAutomatizacionBaseTenant
              organizacionId={tenantId}
              tenantsQlik={tenantsQlik}
            />
          </SeccionAnclada>

          <SeccionAnclada id="impala">
            <SeccionConexionImpala
              organizacionId={tenantId}
              tenantsQlik={tenantsQlik}
            />
          </SeccionAnclada>

          <SeccionAnclada id="origenes">
            <SeccionOrigenesDatos />
          </SeccionAnclada>

          <SeccionAnclada id="usuarios">
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
          </SeccionAnclada>
        </div>
      </div>
    </PageLayout>
  );
}
