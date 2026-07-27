import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/api";

export function estadoVisual(auto: ResumenAutomatizacion): string {
  if (auto.ejecucionActiva) return "En proceso";
  return auto.activa ? "Funcionando" : "Necesita atención";
}

export function claseEstado(auto: ResumenAutomatizacion): string {
  if (auto.ejecucionActiva) {
    return "bg-amber-100 text-amber-800";
  }
  if (auto.activa) {
    return "bg-emerald-100 text-emerald-800";
  }
  return "bg-slate-100 text-slate-700";
}

export function sufijoBusqueda(espacioId?: string): string {
  return espacioId ? `?espacioId=${encodeURIComponent(espacioId)}` : "";
}
