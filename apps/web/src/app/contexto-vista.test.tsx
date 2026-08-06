import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VistaProvider, useVistaUsuarioFinal } from "./contexto-vista";

function Consumidor() {
  const { estado, setModoUsuarioFinal } = useVistaUsuarioFinal();
  return (
    <div>
      <span data-testid="modo">{String(estado.modoUsuarioFinal)}</span>
      <button onClick={() => setModoUsuarioFinal(true)}>Activar</button>
      <button onClick={() => setModoUsuarioFinal(false)}>Desactivar</button>
    </div>
  );
}

describe("useVistaUsuarioFinal", () => {
  it("lanza error si se usa fuera de VistaProvider", () => {
    expect(() => render(<Consumidor />)).toThrow(/VistaProvider/);
  });

  it("inicia con modoUsuarioFinal false", () => {
    render(
      <VistaProvider>
        <Consumidor />
      </VistaProvider>,
    );
    expect(screen.getByTestId("modo")).toHaveTextContent("false");
  });

  it("setModoUsuarioFinal(true) activa el modo", () => {
    render(
      <VistaProvider>
        <Consumidor />
      </VistaProvider>,
    );
    fireEvent.click(screen.getByText("Activar"));
    expect(screen.getByTestId("modo")).toHaveTextContent("true");
  });

  it("setModoUsuarioFinal(false) desactiva el modo", () => {
    render(
      <VistaProvider>
        <Consumidor />
      </VistaProvider>,
    );
    fireEvent.click(screen.getByText("Activar"));
    fireEvent.click(screen.getByText("Desactivar"));
    expect(screen.getByTestId("modo")).toHaveTextContent("false");
  });
});
