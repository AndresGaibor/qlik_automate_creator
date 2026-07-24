import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
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
      mostrarExito("Conexión Directa a Impala configurada correctamente");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  return (
    <div className="pt-3 border-t mt-3 space-y-3 bg-blue-50/30 p-3 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          🐘 Conexión Directa Servidor Impala (Native Impala)
        </h5>
        {tenantQlik.impalaHost ? (
          <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
            ● Host Activo: {tenantQlik.impalaHost}:
            {tenantQlik.impalaPort || 21050}
          </span>
        ) : (
          <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
            ● Sin Servidor Impala Registrado
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Host / IP de Impala *
          </label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="ej: impala.miempresa.com o 10.0.1.50"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Puerto (ej: 21050)
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            placeholder="21050"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Autenticación (Auth)
          </label>
          <select
            value={authMechanism}
            onChange={(e) => setAuthMechanism(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="NOSASL">NOSASL (Sin auth)</option>
            <option value="PLAIN">PLAIN (Usuario/Contraseña)</option>
            <option value="LDAP">LDAP</option>
            <option value="KERBEROS">KERBEROS</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Usuario Impala (Opcional)
          </label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="ej: impala_user"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Contraseña Impala (Opcional)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña..."
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Base de Datos Impala
          </label>
          <input
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="ej: default o ventas"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!host.trim() || guardarImpala.isPending}
          onClick={() => guardarImpala.mutate()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
        >
          {guardarImpala.isPending
            ? "Guardando..."
            : "💾 Guardar Conexión Directa Impala"}
        </Button>
      </div>
    </div>
  );
}
