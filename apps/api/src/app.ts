import { Hono } from "hono";
import { cors } from "hono/cors";
import { autenticacionQlikRouter } from "./modulos/autenticacion-qlik/rutas.js";
import { flujosRouter } from "./modulos/flujos/rutas.js";
import { automatizacionesRouter } from "./modulos/automatizaciones/rutas.js";
import { destinosRouter } from "./modulos/destinos/rutas.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/api/salud", (c) => {
  return c.json({
    success: true,
    data: { estado: "ok", fecha: new Date().toISOString() },
  });
});

app.route("/api/auth/qlik", autenticacionQlikRouter);
app.route("/api/flujos", flujosRouter);
app.route("/api/automatizaciones", automatizacionesRouter);
app.route("/api/destinos", destinosRouter);

app.notFound((c) => {
  return c.json({ success: false, error: "No encontrado" }, 404);
});

app.onError((c, err) => {
  console.error(err);
  return c.json({ success: false, error: "Error interno" }, 500);
});
