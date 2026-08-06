import { CampoDestinoTenant } from "./campo-destino-tenant";
import type {
  ConfiguracionDestino,
  TipoDestino,
} from "./modelo-destino-tenant";

export function CamposDestinoTenant({
  tipo,
  config,
  onCambiar,
}: {
  tipo: TipoDestino;
  config: ConfiguracionDestino;
  onCambiar: (campo: string, valor: string) => void;
}) {
  const campo = (nombre: string) => config[nombre] ?? "";
  return (
    <>
      <CampoDestinoTenant
        label="Host / servidor"
        requerido
        value={campo("host")}
        onChange={(valor) => onCambiar("host", valor)}
        className="md:col-span-7"
      />
      {tipo !== "bigquery" && (
        <CampoDestinoTenant
          label="Puerto"
          value={campo("port")}
          onChange={(valor) => onCambiar("port", valor)}
          className="md:col-span-5"
        />
      )}
      {tipo === "postgres" && (
        <CamposPostgres config={config} onCambiar={onCambiar} />
      )}
      {tipo === "bigquery" && (
        <CamposBigQuery config={config} onCambiar={onCambiar} />
      )}
      {tipo === "sftp" && <CamposSftp config={config} onCambiar={onCambiar} />}
      {tipo === "impala" && (
        <CamposImpala config={config} onCambiar={onCambiar} />
      )}
    </>
  );
}

interface CamposProps {
  config: ConfiguracionDestino;
  onCambiar: (campo: string, valor: string) => void;
}

function Campo({
  config,
  onCambiar,
  nombre,
  label,
  ...props
}: CamposProps & {
  nombre: string;
  label: string;
  type?: string;
  className: string;
}) {
  return (
    <CampoDestinoTenant
      label={label}
      value={config[nombre] ?? ""}
      onChange={(valor) => onCambiar(nombre, valor)}
      {...props}
    />
  );
}

function CamposPostgres(props: CamposProps) {
  return (
    <>
      <Campo
        {...props}
        nombre="database"
        label="Base de datos"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="user"
        label="Usuario"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="password"
        label="Contraseña"
        type="password"
        className="md:col-span-4"
      />
    </>
  );
}

function CamposBigQuery(props: CamposProps) {
  return (
    <>
      <Campo
        {...props}
        nombre="projectId"
        label="Project ID"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="dataset"
        label="Dataset"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="keyFilename"
        label="Key filename"
        className="md:col-span-4"
      />
    </>
  );
}

function CamposSftp(props: CamposProps) {
  return (
    <>
      <Campo
        {...props}
        nombre="user"
        label="Usuario"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="rutaBase"
        label="Ruta base"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="password"
        label="Contraseña"
        type="password"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="privateKey"
        label="Llave privada"
        type="password"
        className="md:col-span-12"
      />
    </>
  );
}

function CamposImpala(props: CamposProps) {
  return (
    <>
      <Campo
        {...props}
        nombre="database"
        label="Base de datos"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="user"
        label="Usuario"
        className="md:col-span-4"
      />
      <Campo
        {...props}
        nombre="password"
        label="Contraseña"
        type="password"
        className="md:col-span-4"
      />
    </>
  );
}
