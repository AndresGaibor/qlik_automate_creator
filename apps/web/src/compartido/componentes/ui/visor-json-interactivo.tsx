import { useState } from "react";

interface Props {
  data: unknown;
  nivel?: number;
  nombre?: string;
  inicialColapsado?: boolean;
  esUltimo?: boolean;
}

export function VisorJsonInteractivo({
  data,
  nivel = 0,
  nombre,
  inicialColapsado = false,
  esUltimo = true,
}: Props) {
  const [colapsado, setColapsado] = useState(inicialColapsado || nivel > 2);
  const coma = !esUltimo ? (
    <span className="text-slate-500 font-bold ml-0.5">,</span>
  ) : null;

  if (data === null) {
    return (
      <div className="font-mono text-xs leading-relaxed inline">
        {nombre && (
          <span className="text-sky-700 font-semibold mr-1">"{nombre}":</span>
        )}
        <span className="text-rose-600 font-semibold">null</span>
        {coma}
      </div>
    );
  }

  if (data === undefined) {
    return (
      <div className="font-mono text-xs leading-relaxed inline">
        {nombre && (
          <span className="text-sky-700 font-semibold mr-1">"{nombre}":</span>
        )}
        <span className="text-slate-400 italic">undefined</span>
        {coma}
      </div>
    );
  }

  const tipo = typeof data;

  if (tipo === "boolean") {
    return (
      <div className="font-mono text-xs leading-relaxed inline">
        {nombre && (
          <span className="text-sky-700 font-semibold mr-1">"{nombre}":</span>
        )}
        <span className="text-amber-700 font-semibold">{String(data)}</span>
        {coma}
      </div>
    );
  }

  if (tipo === "number") {
    return (
      <div className="font-mono text-xs leading-relaxed inline">
        {nombre && (
          <span className="text-sky-700 font-semibold mr-1">"{nombre}":</span>
        )}
        <span className="text-emerald-700 font-medium">{String(data)}</span>
        {coma}
      </div>
    );
  }

  if (tipo === "string") {
    return (
      <div className="font-mono text-xs leading-relaxed inline break-all">
        {nombre && (
          <span className="text-sky-700 font-semibold mr-1">"{nombre}":</span>
        )}
        <span className="text-emerald-800">"{String(data)}"</span>
        {coma}
      </div>
    );
  }

  if (Array.isArray(data)) {
    const esVacio = data.length === 0;

    return (
      <div className="font-mono text-xs leading-relaxed">
        <div className="inline-flex items-center gap-1">
          {nombre && (
            <span className="text-sky-700 font-semibold">"{nombre}":</span>
          )}
          {!esVacio && (
            <button
              type="button"
              onClick={() => setColapsado(!colapsado)}
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
              aria-label={colapsado ? "Expandir arreglo" : "Contraer arreglo"}
              title={colapsado ? "Expandir" : "Contraer"}
            >
              {colapsado ? ">" : "v"}
            </button>
          )}
          <span className="text-slate-600 font-bold">[</span>
          {colapsado && !esVacio && (
            <button
              type="button"
              onClick={() => setColapsado(false)}
              className="text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-1.5 py-0.5 rounded text-[11px] cursor-pointer transition-colors"
            >
              {data.length} elementos...
            </button>
          )}
          {esVacio && <span className="text-slate-600 font-bold">]{coma}</span>}
        </div>

        {!colapsado && !esVacio && (
          <div className="pl-4 border-l border-slate-300 ml-1.5 space-y-0.5 my-0.5">
            {data.map((elem, idx) => (
              <div key={JSON.stringify(elem)} className="block">
                <span className="text-slate-400 mr-1 select-none text-[11px]">
                  {idx}:
                </span>
                <VisorJsonInteractivo
                  data={elem}
                  nivel={nivel + 1}
                  esUltimo={idx === data.length - 1}
                />
              </div>
            ))}
          </div>
        )}

        {!colapsado && !esVacio && (
          <div className="text-slate-600 font-bold">]{coma}</div>
        )}
      </div>
    );
  }

  // Objeto
  const llaves = Object.keys(data as object);
  const esVacio = llaves.length === 0;

  return (
    <div className="font-mono text-xs leading-relaxed">
      <div className="inline-flex items-center gap-1">
        {nombre && (
          <span className="text-sky-700 font-semibold">"{nombre}":</span>
        )}
        {!esVacio && (
          <button
            type="button"
            onClick={() => setColapsado(!colapsado)}
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
            aria-label={colapsado ? "Expandir objeto" : "Contraer objeto"}
            title={colapsado ? "Expandir" : "Contraer"}
          >
            {colapsado ? ">" : "v"}
          </button>
        )}
        <span className="text-slate-600 font-bold">&#123;</span>
        {colapsado && !esVacio && (
          <button
            type="button"
            onClick={() => setColapsado(false)}
            className="text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-1.5 py-0.5 rounded text-[11px] cursor-pointer transition-colors"
          >
            {llaves.length} claves...
          </button>
        )}
        {esVacio && (
          <span className="text-slate-600 font-bold">&#125;{coma}</span>
        )}
      </div>

      {!colapsado && !esVacio && (
        <div className="pl-4 border-l border-slate-300 ml-1.5 space-y-0.5 my-0.5">
          {llaves.map((clave, idx) => (
            <div key={clave} className="block">
              <VisorJsonInteractivo
                data={(data as Record<string, unknown>)[clave]}
                nombre={clave}
                nivel={nivel + 1}
                esUltimo={idx === llaves.length - 1}
              />
            </div>
          ))}
        </div>
      )}

      {!colapsado && !esVacio && (
        <div className="text-slate-600 font-bold">&#125;{coma}</div>
      )}
    </div>
  );
}
