import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/publico";

export function estadoVisual(auto: ResumenAutomatizacion): string {
  if (auto.ejecucionActiva) return "En ejecución";
  return auto.activa ? "Disponible" : "Inactiva";
}

export function claseEstado(auto: ResumenAutomatizacion): string {
  if (auto.ejecucionActiva) {
    return "border border-amber-200 bg-amber-50 text-amber-800";
  }
  if (!auto.activa) {
    return "border border-line-200 bg-app text-ink-500";
  }
  return "border border-brand-100 bg-brand-50 text-brand-700";
}

export function sufijoBusqueda(espacioId?: string): string {
  return espacioId ? `?espacioId=${encodeURIComponent(espacioId)}` : "";
}
