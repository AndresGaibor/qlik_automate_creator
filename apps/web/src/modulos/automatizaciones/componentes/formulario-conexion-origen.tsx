import { Button } from "@/compartido/componentes/ui/button";
import { type FormEvent, useState } from "react";
import { guardarConexionOrigen, probarConexionOrigen } from "../api";

interface Props {
  requisito: { tipo: "jdbc" | "sftp"; nombre: string };
  onGuardada(id: string): void;
}

const campo =
  "mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-600";

function nombreSecreto(nombre: string, prefijo: string) {
  const id = nombre
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${prefijo}_${id || "CONEXION"}`;
}

export function FormularioConexionOrigen({ requisito, onGuardada }: Props) {
  const [servidor, setServidor] = useState("");
  const [puerto, setPuerto] = useState(requisito.tipo === "jdbc" ? 5432 : 22);
  const [baseDatos, setBaseDatos] = useState("");
  const [usuario, setUsuario] = useState("");
  const [secreto, setSecreto] = useState("");
  const [rutaBase, setRutaBase] = useState("/upload");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const entrada =
        requisito.tipo === "jdbc"
          ? {
              tipo: "jdbc" as const,
              nombre: requisito.nombre,
              config: {
                url: `jdbc:postgresql://${servidor.trim()}:${puerto}/${baseDatos.trim()}`,
                driver: "org.postgresql.Driver",
                secreto_nombre: nombreSecreto(requisito.nombre, "JDBC"),
                propiedades: { fetchsize: "10000" },
                ...(secreto ? { secretoValor: secreto } : {}),
              },
            }
          : {
              tipo: "sftp" as const,
              nombre: requisito.nombre,
              config: {
                host: servidor.trim(),
                puerto,
                usuario: usuario.trim(),
                secreto_clave_privada_nombre: nombreSecreto(
                  requisito.nombre,
                  "SFTP_PRIVATE_KEY_B64",
                ),
                ruta_base: rutaBase.trim() || "/upload",
                ...(secreto ? { secretoClavePrivadaValor: secreto } : {}),
              },
            };
      const creada = await guardarConexionOrigen(entrada);
      await probarConexionOrigen(creada.id);
      onGuardada(creada.id);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo guardar la conexión",
      );
    } finally {
      setSecreto("");
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={enviar}
      className="space-y-3 rounded-lg border border-line-200 p-4"
    >
      <p className="text-sm font-semibold text-ink-900">{requisito.nombre}</p>
      <label className="block text-xs font-semibold text-ink-700">
        Servidor
        <input
          required
          value={servidor}
          onChange={(e) => setServidor(e.target.value)}
          className={campo}
        />
      </label>
      <label className="block text-xs font-semibold text-ink-700">
        Puerto
        <input
          required
          type="number"
          value={puerto}
          onChange={(e) => setPuerto(Number(e.target.value))}
          className={campo}
        />
      </label>
      {requisito.tipo === "jdbc" ? (
        <>
          <label className="block text-xs font-semibold text-ink-700">
            Base de datos
            <input
              required
              value={baseDatos}
              onChange={(e) => setBaseDatos(e.target.value)}
              className={campo}
            />
          </label>
          <label className="block text-xs font-semibold text-ink-700">
            Credenciales (usuario:clave)
            <input
              required
              type="password"
              value={secreto}
              onChange={(e) => setSecreto(e.target.value)}
              className={campo}
            />
          </label>
        </>
      ) : (
        <>
          <label className="block text-xs font-semibold text-ink-700">
            Usuario
            <input
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={campo}
            />
          </label>
          <label className="block text-xs font-semibold text-ink-700">
            Carpeta de salida
            <input
              required
              value={rutaBase}
              onChange={(e) => setRutaBase(e.target.value)}
              className={campo}
            />
          </label>
          <label className="block text-xs font-semibold text-ink-700">
            Llave privada
            <textarea
              required
              value={secreto}
              onChange={(e) => setSecreto(e.target.value)}
              className={`${campo} min-h-24 font-mono text-xs`}
            />
          </label>
        </>
      )}
      {error && <p className="text-xs text-danger-600">{error}</p>}
      <Button type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar y probar"}
      </Button>
    </form>
  );
}
