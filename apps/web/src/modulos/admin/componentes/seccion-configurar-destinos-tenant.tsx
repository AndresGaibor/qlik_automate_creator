import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import {
  type TenantQlik,
  configurarConexionDestino,
} from "@/modulos/admin/api";
import type { ConfigurarConexionDestino } from "@qlik/contratos/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const TIPOS = [
  { id: "postgres", nombre: "PostgreSQL", deshabilitado: false },
  { id: "bigquery", nombre: "BigQuery", deshabilitado: true },
  { id: "sftp", nombre: "SFTP", deshabilitado: false },
  { id: "impala", nombre: "Impala", deshabilitado: false },
] as const;

type Tipo = (typeof TIPOS)[number]["id"];

function configuracionInicial(tipo: Tipo): Record<string, string> {
  if (tipo === "postgres") return { port: "5432" };
  if (tipo === "sftp") return { port: "22", rutaBase: "/" };
  if (tipo === "impala") return { port: "21050", database: "default" };
  return {};
}

export function SeccionConfigurarDestinosTenant({
  organizacionId,
  tenantQlik,
  cantidadExistentes = 0,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
  cantidadExistentes?: number;
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [tipo, setTipo] = useState<Tipo>("postgres");
  const [nombre, setNombre] = useState("");
  const [config, setConfig] = useState<Record<string, string>>(() =>
    configuracionInicial("postgres"),
  );
  const [formularioAbierto, setFormularioAbierto] = useState(
    cantidadExistentes === 0,
  );

  const guardar = useMutation({
    mutationFn: () => {
      const entrada: ConfigurarConexionDestino = {
        tipo,
        nombre: nombre.trim(),
        config,
      };
      return configurarConexionDestino(organizacionId, tenantQlik.id, entrada);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-tenants-qlik", organizacionId],
        }),
        queryClient.invalidateQueries({ queryKey: ["destinos-conexiones"] }),
      ]);
      mostrarExito("Conexión de destino guardada");
      setNombre("");
      setConfig(configuracionInicial(tipo));
      setFormularioAbierto(false);
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const cambiar = (campo: string, valor: string) =>
    setConfig((anterior) => ({ ...anterior, [campo]: valor }));

  const seleccionarTipo = (nuevoTipo: Tipo) => {
    setTipo(nuevoTipo);
    setConfig(configuracionInicial(nuevoTipo));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-xl border border-line-200 bg-app/25 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-obj-50 text-obj-700">
            <Icon name="db" size="sm" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-900">
              {cantidadExistentes}{" "}
              {cantidadExistentes === 1
                ? "destino configurado"
                : "destinos configurados"}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              PostgreSQL, SFTP e Impala pueden reutilizarse en nuevos procesos.
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant={formularioAbierto ? "ghost" : "outline"}
          aria-expanded={formularioAbierto}
          className="shrink-0 gap-1.5"
          onClick={() => setFormularioAbierto((actual) => !actual)}
        >
          <Icon name={formularioAbierto ? "x" : "plus"} size="sm" />
          {formularioAbierto
            ? "Cerrar formulario"
            : cantidadExistentes > 0
              ? "Agregar otro destino"
              : "Agregar destino"}
        </Button>
      </div>

      {formularioAbierto && (
        <div className="rounded-xl border border-line-200 bg-surface">
          <div className="rounded-t-xl border-b border-line-200 bg-app/30 px-4 py-3">
            <p className="text-sm font-semibold text-ink-900">
              Nueva conexión de destino
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              Usa un nombre reconocible para que los usuarios puedan elegirla
              sin conocer detalles técnicos.
            </p>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-12">
            <label className="block text-xs font-semibold text-ink-700 md:col-span-8">
              Nombre visible <span className="text-danger-600">*</span>
              <input
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Nombre de la conexión, por ejemplo Producción"
                className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <label className="block text-xs font-semibold text-ink-700 md:col-span-4">
              Tipo de destino
              <select
                value={tipo}
                onChange={(evento) =>
                  seleccionarTipo(evento.target.value as Tipo)
                }
                className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                aria-label="Tipo de destino"
              >
                {TIPOS.map((opcion) => (
                  <option
                    key={opcion.id}
                    value={opcion.id}
                    disabled={opcion.deshabilitado}
                  >
                    {opcion.nombre}
                  </option>
                ))}
              </select>
            </label>

            <Campo
              label="Host / servidor"
              requerido
              value={config.host ?? ""}
              onChange={(valor) => cambiar("host", valor)}
              className="md:col-span-7"
            />
            {tipo !== "bigquery" && (
              <Campo
                label="Puerto"
                value={config.port ?? ""}
                onChange={(valor) => cambiar("port", valor)}
                className="md:col-span-5"
              />
            )}

            {tipo === "postgres" && (
              <>
                <Campo
                  label="Base de datos"
                  value={config.database ?? ""}
                  onChange={(valor) => cambiar("database", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Usuario"
                  value={config.user ?? ""}
                  onChange={(valor) => cambiar("user", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Contraseña"
                  type="password"
                  value={config.password ?? ""}
                  onChange={(valor) => cambiar("password", valor)}
                  className="md:col-span-4"
                />
              </>
            )}

            {tipo === "bigquery" && (
              <>
                <Campo
                  label="Project ID"
                  value={config.projectId ?? ""}
                  onChange={(valor) => cambiar("projectId", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Dataset"
                  value={config.dataset ?? ""}
                  onChange={(valor) => cambiar("dataset", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Key filename"
                  value={config.keyFilename ?? ""}
                  onChange={(valor) => cambiar("keyFilename", valor)}
                  className="md:col-span-4"
                />
              </>
            )}

            {tipo === "sftp" && (
              <>
                <Campo
                  label="Usuario"
                  value={config.user ?? ""}
                  onChange={(valor) => cambiar("user", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Ruta base"
                  value={config.rutaBase ?? "/"}
                  onChange={(valor) => cambiar("rutaBase", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Contraseña"
                  type="password"
                  value={config.password ?? ""}
                  onChange={(valor) => cambiar("password", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Llave privada"
                  type="password"
                  value={config.privateKey ?? ""}
                  onChange={(valor) => cambiar("privateKey", valor)}
                  className="md:col-span-12"
                />
              </>
            )}

            {tipo === "impala" && (
              <>
                <Campo
                  label="Base de datos"
                  value={config.database ?? "default"}
                  onChange={(valor) => cambiar("database", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Usuario"
                  value={config.user ?? ""}
                  onChange={(valor) => cambiar("user", valor)}
                  className="md:col-span-4"
                />
                <Campo
                  label="Contraseña"
                  type="password"
                  value={config.password ?? ""}
                  onChange={(valor) => cambiar("password", valor)}
                  className="md:col-span-4"
                />
              </>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line-200 bg-app/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-ink-500">
              Los campos marcados con * son obligatorios.
            </p>
            <div className="flex justify-end gap-2">
              {cantidadExistentes > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setFormularioAbierto(false)}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={
                  !nombre.trim() || !config.host?.trim() || guardar.isPending
                }
                onClick={() => guardar.mutate()}
                className="gap-1.5"
              >
                <Icon name="check" size="sm" />
                {guardar.isPending ? "Guardando…" : "Guardar destino"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  requerido = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  requerido?: boolean;
}) {
  return (
    <label className={`block text-xs font-semibold text-ink-700 ${className}`}>
      {label} {requerido && <span className="text-danger-600">*</span>}
      <input
        type={type}
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
