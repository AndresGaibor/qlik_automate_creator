import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TenantQlik } from "@/modulos/admin/api";
import { configurarImpalaTenant } from "@/modulos/admin/api";
import { useState } from "react";

interface Props {
  organizacionId: string;
  tenantQlik: TenantQlik;
}

export function SeccionConfigurarImpalaTenant({
  organizacionId,
  tenantQlik,
}: Props) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [host, setHost] = useState(tenantQlik.impalaHost || "");
  const [port, setPort] = useState(tenantQlik.impalaPort || 21050);
  const [authMechanism, setAuthMechanism] = useState(
    tenantQlik.impalaAuthMechanism || "NOSASL",
  );
  const [user, setUser] = useState(tenantQlik.impalaUser || "");
  const [password, setPassword] = useState(tenantQlik.impalaPassword || "");
  const [database, setDatabase] = useState(
    tenantQlik.impalaDatabase || "default",
  );

  const guardarImpala = useMutation({
    mutationFn: () =>
      configurarImpalaTenant(organizacionId, tenantQlik.id, {
        impalaHost: host.trim(),
        impalaPort: Number(port),
        impalaAuthMechanism: authMechanism,
        impalaUser: user.trim() || undefined,
        impalaPassword: password.trim() || undefined,
        impalaDatabase: database.trim() || "default",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Conexión a Impala guardada correctamente");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const necesitaCredenciales =
    authMechanism === "PLAIN" || authMechanism === "LDAP";

  return (
    <div className="space-y-3">
      {/* Fila 1: host + puerto */}
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-700 mb-1">
            Host o IP del servidor{" "}
            <span className="text-danger-600">*</span>
          </label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="ej: impala.empresa.com o 10.0.1.50"
            className="w-full px-3 py-1.5 text-xs border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-700 mb-1">
            Puerto
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            placeholder="21050"
            className="w-full px-3 py-1.5 text-xs border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-700 mb-1">
            Base de datos
          </label>
          <input
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="ej: default"
            className="w-full px-3 py-1.5 text-xs border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Fila 2: autenticación */}
      <div>
        <label className="block text-xs font-semibold text-ink-700 mb-1">
          Método de autenticación
        </label>
        <select
          value={authMechanism}
          onChange={(e) => setAuthMechanism(e.target.value)}
          className="w-full px-3 py-1.5 text-xs border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
        >
          <option value="NOSASL">Sin autenticación (NOSASL)</option>
          <option value="PLAIN">Usuario / Contraseña (PLAIN)</option>
          <option value="LDAP">LDAP</option>
          <option value="KERBEROS">Kerberos</option>
        </select>
      </div>

      {/* Fila 3: credenciales — solo si el método las requiere */}
      {necesitaCredenciales && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ej: impala_user"
              className="w-full px-3 py-1.5 text-xs border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de Impala"
              className="w-full px-3 py-1.5 text-xs border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button
          size="sm"
          disabled={!host.trim() || guardarImpala.isPending}
          onClick={() => guardarImpala.mutate()}
          className="gap-1.5 text-xs"
        >
          <Icon name="check" size="sm" />
          {guardarImpala.isPending ? "Guardando…" : "Guardar conexión Impala"}
        </Button>
      </div>
    </div>
  );
}
