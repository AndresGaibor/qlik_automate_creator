import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import {
  configurarConexionDestino,
  type TenantQlik,
} from "@/modulos/admin/api";
import type { ConfigurarConexionDestino } from "@qlik/contratos/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";

const TIPOS = [
  { id: "postgres", nombre: "PostgreSQL" },
  { id: "bigquery", nombre: "BigQuery" },
  { id: "sftp", nombre: "SFTP" },
  { id: "impala", nombre: "Impala" },
] as const;

type Tipo = (typeof TIPOS)[number]["id"];

export function SeccionConfigurarDestinosTenant({
  organizacionId,
  tenantQlik,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [tipo, setTipo] = useState<Tipo>("postgres");
  const [nombre, setNombre] = useState("");
  const [config, setConfig] = useState<Record<string, string>>({});

  const guardar = useMutation({
    mutationFn: () => {
      const entrada: ConfigurarConexionDestino = { tipo, nombre, config };
      return configurarConexionDestino(organizacionId, tenantQlik.id, entrada);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants-qlik", organizacionId] });
      mostrarExito("Conexión de destino guardada");
      setConfig({});
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const cambiar = (campo: string, valor: string) =>
    setConfig((anterior) => ({ ...anterior, [campo]: valor }));

  return (
    <div className="space-y-4 rounded-lg border border-line-200 bg-app/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Agregar destino</p>
          <p className="text-xs text-ink-500">Configura una conexión para este entorno Qlik.</p>
        </div>
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value as Tipo);
            setConfig({});
          }}
          className="rounded-md border border-line-200 bg-surface px-3 py-2 text-sm"
          aria-label="Tipo de destino"
        >
          {TIPOS.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>{opcion.nombre}</option>
          ))}
        </select>
      </div>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la conexión, por ejemplo Producción"
        className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Campo label="Host / servidor" value={config.host ?? ""} onChange={(v) => cambiar("host", v)} />
        {tipo !== "bigquery" && <Campo label="Puerto" value={config.port ?? (tipo === "sftp" ? "22" : "5432")} onChange={(v) => cambiar("port", v)} />}
        {tipo === "postgres" && <>
          <Campo label="Base de datos" value={config.database ?? ""} onChange={(v) => cambiar("database", v)} />
          <Campo label="Usuario" value={config.user ?? ""} onChange={(v) => cambiar("user", v)} />
          <Campo label="Contraseña" type="password" value={config.password ?? ""} onChange={(v) => cambiar("password", v)} />
        </>}
        {tipo === "bigquery" && <>
          <Campo label="Project ID" value={config.projectId ?? ""} onChange={(v) => cambiar("projectId", v)} />
          <Campo label="Dataset" value={config.dataset ?? ""} onChange={(v) => cambiar("dataset", v)} />
          <Campo label="Key filename" value={config.keyFilename ?? ""} onChange={(v) => cambiar("keyFilename", v)} />
        </>}
        {tipo === "sftp" && <>
          <Campo label="Usuario" value={config.user ?? ""} onChange={(v) => cambiar("user", v)} />
          <Campo label="Ruta base" value={config.rutaBase ?? "/"} onChange={(v) => cambiar("rutaBase", v)} />
          <Campo label="Contraseña" type="password" value={config.password ?? ""} onChange={(v) => cambiar("password", v)} />
          <Campo label="Llave privada" type="password" value={config.privateKey ?? ""} onChange={(v) => cambiar("privateKey", v)} />
        </>}
        {tipo === "impala" && <>
          <Campo label="Base de datos" value={config.database ?? "default"} onChange={(v) => cambiar("database", v)} />
          <Campo label="Usuario" value={config.user ?? ""} onChange={(v) => cambiar("user", v)} />
          <Campo label="Contraseña" type="password" value={config.password ?? ""} onChange={(v) => cambiar("password", v)} />
        </>}
      </div>

      <div className="flex justify-end">
        <Button disabled={!nombre.trim() || !config.host?.trim() || guardar.isPending} onClick={() => guardar.mutate()} className="gap-1.5">
          <Icon name="check" size="sm" />
          {guardar.isPending ? "Guardando…" : "Guardar destino"}
        </Button>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-xs font-semibold text-ink-700">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm font-normal" />
    </label>
  );
}
