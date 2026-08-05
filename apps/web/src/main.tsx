import "@/index.css";
import { Proveedores, clienteConsultas } from "@/app/proveedores";
import { clienteApi } from "@/compartido/api/cliente";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { obtenerMotivoSesion } from "@/modulos/autenticacion/motivo-sesion";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./app/router";

clienteApi.onUnauthorized = (codigo) => {
  clienteConsultas.clear();
  const motivo = obtenerMotivoSesion(codigo);
  router.navigate({ to: "/login", replace: true, search: { motivo_sesion: motivo } });
};

const raiz = document.getElementById("root");
if (!raiz) throw new Error("No se encontró el elemento #root");

ReactDOM.createRoot(raiz).render(
  <React.StrictMode>
    <Proveedores>
      <NotificacionesProvider>
        <RouterProvider router={router} />
      </NotificacionesProvider>
    </Proveedores>
  </React.StrictMode>,
);
