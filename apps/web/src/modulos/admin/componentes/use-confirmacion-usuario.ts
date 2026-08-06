import { useState } from "react";
import type { RolUsuarioTenant, UsuarioTenant } from "./tipos-usuarios-tenant";
import {
  puedeCambiarRolUsuario,
  puedeQuitarUsuario,
} from "./usuarios-permisos";

interface DialogoUsuario {
  open: boolean;
  titulo: string;
  mensaje: string;
  onConfirm: () => void;
}

const dialogoInicial: DialogoUsuario = {
  open: false,
  titulo: "Confirmar cambio",
  mensaje: "",
  onConfirm: () => {},
};

export function useConfirmacionUsuario({
  usuarios,
  onActualizarRol,
  onEliminarUsuario,
}: {
  usuarios: UsuarioTenant[];
  onActualizarRol: (params: {
    usuarioId: string;
    rol: RolUsuarioTenant;
  }) => void;
  onEliminarUsuario: (usuarioId: string) => void;
}) {
  const [dialogo, setDialogo] = useState<DialogoUsuario>(dialogoInicial);

  function solicitarRol(usuario: UsuarioTenant, rol: RolUsuarioTenant) {
    if (!puedeCambiarRolUsuario(usuario, rol, usuarios)) return;
    if (usuario.rol === "admin" && rol === "usuario") {
      setDialogo({
        open: true,
        titulo: "Retirar permisos de administrador",
        mensaje: `¿Cambiar a "${usuario.nombre}" a Usuario final? Dejará de administrar configuraciones y usuarios.`,
        onConfirm: () => onActualizarRol({ usuarioId: usuario.id, rol }),
      });
      return;
    }
    onActualizarRol({ usuarioId: usuario.id, rol });
  }

  function solicitarQuitar(usuario: UsuarioTenant) {
    if (!puedeQuitarUsuario(usuario, usuarios)) return;
    setDialogo({
      open: true,
      titulo: "Quitar acceso al usuario",
      mensaje: `¿Quitar el acceso a "${usuario.nombre}" (${usuario.correo})? Esta persona dejará de poder iniciar sesión.`,
      onConfirm: () => onEliminarUsuario(usuario.id),
    });
  }

  function cerrar() {
    setDialogo((actual) => ({ ...actual, open: false }));
  }

  function confirmar() {
    dialogo.onConfirm();
    cerrar();
  }

  return { dialogo, solicitarRol, solicitarQuitar, cerrar, confirmar };
}
