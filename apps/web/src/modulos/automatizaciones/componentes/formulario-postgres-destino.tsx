import { Button } from "@/compartido/componentes/ui/button";
import { type FormEvent, useState } from "react";
import { crearConexionDestino, probarConexionDestino } from "../api";

const campo =
  "mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-600";

export function FormularioPostgresDestino({
  onGuardada,
}: {
  onGuardada(id: string): void;
}) {
  const [nombre, setNombre] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState(5432);
  const [database, setDatabase] = useState("");
  const [schema, setSchema] = useState("public");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [ssl, setSsl] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const creada = await crearConexionDestino({
        tipo: "postgres",
        nombre: nombre.trim(),
        config: {
          host: host.trim(),
          port,
          database: database.trim(),
          schema: schema.trim() || "public",
          user: user.trim(),
          password,
          ssl,
        },
      });
      const prueba = await probarConexionDestino(creada.id);
      if (!prueba.exitoso) throw new Error(prueba.mensaje);
      onGuardada(creada.id);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo guardar el destino",
      );
    } finally {
      setPassword("");
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={enviar}
      className="grid gap-3 rounded-lg border border-line-200 p-4 sm:grid-cols-2"
    >
      {[
        ["Nombre", nombre, setNombre],
        ["Servidor", host, setHost],
        ["Base de datos", database, setDatabase],
        ["Esquema", schema, setSchema],
        ["Usuario", user, setUser],
      ].map(([etiqueta, valor, setter]) => (
        <label
          key={etiqueta as string}
          className="block text-xs font-semibold text-ink-700"
        >
          {etiqueta as string}
          <input
            required
            value={valor as string}
            onChange={(e) => (setter as (v: string) => void)(e.target.value)}
            className={campo}
          />
        </label>
      ))}
      <label className="block text-xs font-semibold text-ink-700">
        Puerto
        <input
          required
          type="number"
          value={port}
          onChange={(e) => setPort(Number(e.target.value))}
          className={campo}
        />
      </label>
      <label className="block text-xs font-semibold text-ink-700">
        Contraseña
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={campo}
        />
      </label>
      <label className="flex items-center gap-2 self-end pb-2 text-xs font-semibold text-ink-700">
        <input
          type="checkbox"
          checked={ssl}
          onChange={(e) => setSsl(e.target.checked)}
        />
        Usar SSL
      </label>
      {error && (
        <p className="text-xs text-danger-600 sm:col-span-2">{error}</p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar y probar"}
        </Button>
      </div>
    </form>
  );
}
