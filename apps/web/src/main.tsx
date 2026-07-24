import "@/index.css";
import { Proveedores } from "@/app/proveedores";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./app/router";

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
