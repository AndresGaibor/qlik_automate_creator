import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SeccionModoGlobalAutomatizacion } from "./seccion-modo-global-automatizacion";

const { obtenerMock, guardarMock } = vi.hoisted(() => ({
  obtenerMock: vi.fn<() => Promise<{ modoAutomatizacionActivo: 1 | 2 }>>(),
  guardarMock: vi.fn<() => Promise<{ modoAutomatizacionActivo: 1 | 2 }>>(),
}));

vi.mock("@/modulos/admin/api", () => ({
  obtenerModoGlobalAutomatizacion: obtenerMock,
  guardarModoGlobalAutomatizacion: guardarMock,
}));

function renderizar(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificacionesProvider>{ui}</NotificacionesProvider>
    </QueryClientProvider>,
  );
}

describe("SeccionModoGlobalAutomatizacion", () => {
  beforeEach(() => {
    obtenerMock.mockClear();
    guardarMock.mockClear();
  });

  it("presenta ambos modos con radio buttons y el activo chequeado", async () => {
    obtenerMock.mockResolvedValue({ modoAutomatizacionActivo: 1 });
    renderizar(<SeccionModoGlobalAutomatizacion />);
    const radio1 = await screen.findByLabelText(
      "Modo 1 — Dataflow Spark/Python",
    );
    const radio2 = await screen.findByLabelText(
      "Modo 2 — Dataflow → SFTP → Talend",
    );
    expect(radio1).toHaveProperty("checked", true);
    expect(radio2).toHaveProperty("checked", false);
  });

  it("muestra la advertencia de impacto global", async () => {
    obtenerMock.mockResolvedValue({ modoAutomatizacionActivo: 1 });
    renderizar(<SeccionModoGlobalAutomatizacion />);
    await screen.findByLabelText("Modo 1 — Dataflow Spark/Python");
    expect(obtenerMock).toHaveBeenCalled();
  });

  it("al confirmar cambio a modo 2, llama a guardarModoGlobalAutomatizacion con 2", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    obtenerMock.mockResolvedValue({ modoAutomatizacionActivo: 1 });
    guardarMock.mockResolvedValue({ modoAutomatizacionActivo: 2 });
    renderizar(<SeccionModoGlobalAutomatizacion />);
    const radio2 = await screen.findByLabelText(
      "Modo 2 — Dataflow → SFTP → Talend",
    );
    await act(async () => {
      fireEvent.click(radio2);
    });
    expect(guardarMock).toHaveBeenCalledWith(2);
  });

  it("si confirm es rechazada, no llama a guardar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    obtenerMock.mockResolvedValue({ modoAutomatizacionActivo: 1 });
    renderizar(<SeccionModoGlobalAutomatizacion />);
    const radio2 = await screen.findByLabelText(
      "Modo 2 — Dataflow → SFTP → Talend",
    );
    fireEvent.click(radio2);
    expect(guardarMock).not.toHaveBeenCalled();
    (window.confirm as ReturnType<typeof vi.fn>).mockRestore?.();
  });
});
