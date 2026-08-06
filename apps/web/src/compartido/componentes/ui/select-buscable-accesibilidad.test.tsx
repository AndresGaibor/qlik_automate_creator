import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectBuscable } from "./select-buscable";

const opciones = [
  { id: "uno", nombre: "Primera", espacioNombre: "Ventas" },
  { id: "dos", nombre: "Segunda", espacioNombre: "Finanzas" },
];

describe("SelectBuscable accesible", () => {
  it("expone semántica de listbox y selección", () => {
    render(
      <SelectBuscable
        etiqueta="Destino"
        opciones={opciones}
        valorSeleccionado="dos"
        onSeleccionar={vi.fn()}
      />,
    );

    const disparador = screen.getByRole("button", { name: "Destino" });
    expect(disparador).toHaveAttribute("aria-haspopup", "listbox");
    fireEvent.click(disparador);

    expect(
      screen.getByRole("listbox", { name: "Destino" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Segunda/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("permite recorrer y seleccionar opciones con teclado", () => {
    const onSeleccionar = vi.fn();
    render(
      <SelectBuscable
        etiqueta="Destino"
        opciones={opciones}
        valorSeleccionado=""
        onSeleccionar={onSeleccionar}
      />,
    );

    const disparador = screen.getByRole("button", { name: "Destino" });
    fireEvent.keyDown(disparador, { key: "ArrowDown" });
    const busqueda = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.keyDown(busqueda, { key: "ArrowDown" });

    const primera = screen.getByRole("option", { name: /Primera/ });
    const segunda = screen.getByRole("option", { name: /Segunda/ });
    expect(primera).toHaveFocus();
    fireEvent.keyDown(primera, { key: "ArrowDown" });
    expect(segunda).toHaveFocus();
    fireEvent.keyDown(segunda, { key: "Enter" });

    expect(onSeleccionar).toHaveBeenCalledWith("dos");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(disparador).toHaveFocus();
  });
});
