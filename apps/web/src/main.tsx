import "@/index.css";
import { Proveedores, clienteConsultas } from "@/app/proveedores";
import { clienteApi } from "@/compartido/api/cliente";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./app/router";

clienteApi.onUnauthorized = () => {
  clienteConsultas.clear();
  router.navigate({ to: "/login", replace: true });
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
