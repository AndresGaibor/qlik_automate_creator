import { Card, CardContent } from "@/compartido/componentes/ui/card";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import type { DetalleTenant } from "../api";
import { CabeceraUsuariosTenant } from "./cabecera-usuarios-tenant";
import { ListaUsuariosTenant } from "./lista-usuarios-tenant";
import { ModalAgregarUsuario } from "./modal-agregar-usuario";
import { useConfirmacionUsuario } from "./use-confirmacion-usuario";

type UsuarioTenant = DetalleTenant["usuarios"][number];

interface Props {
  usuarios: UsuarioTenant[];
  onActualizarRol: (params: {
    usuarioId: string;
    rol: "admin" | "usuario";
  }) => void;
  onEliminarUsuario: (usuarioId: string) => void;
  onAbrirModalAgregar: () => void;
  modalAgregar: {
    open: boolean;
    onClose: () => void;
    onAgregar: (correo: string, rol: "admin" | "usuario") => void;
    isPending: boolean;
  };
  actualizar: { isPending: boolean };
  eliminar: { isPending: boolean };
}

export function SeccionUsuarios({
  usuarios,
  onActualizarRol,
  onEliminarUsuario,
  onAbrirModalAgregar,
  modalAgregar,
  actualizar,
  eliminar,
}: Props) {
  const confirmacion = useConfirmacionUsuario({
    usuarios,
    onActualizarRol,
    onEliminarUsuario,
  });
  const ocupado = actualizar.isPending || eliminar.isPending;

  return (
    <>
      <Card className="border-line-200 bg-surface shadow-card">
        <CabeceraUsuariosTenant
          cantidad={usuarios.length}
          onAgregar={onAbrirModalAgregar}
        />
        <CardContent className="p-0">
          <ListaUsuariosTenant
            usuarios={usuarios}
            ocupado={ocupado}
            onRol={confirmacion.solicitarRol}
            onQuitar={confirmacion.solicitarQuitar}
          />
        </CardContent>
      </Card>
      <ModalAgregarUsuario
        open={modalAgregar.open}
        onClose={modalAgregar.onClose}
        onAgregar={modalAgregar.onAgregar}
        isPending={modalAgregar.isPending}
      />
      <ConfirmDialog
        open={confirmacion.dialogo.open}
        onCancel={confirmacion.cerrar}
        onConfirm={confirmacion.confirmar}
        titulo={confirmacion.dialogo.titulo}
        mensaje={confirmacion.dialogo.mensaje}
      />
    </>
  );
}
