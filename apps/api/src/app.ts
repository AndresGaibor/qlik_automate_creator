import { Hono } from "hono";
import { cors } from "hono/cors";
import { autenticacionQlikRouter } from "./modulos/autenticacion-qlik/rutas.js";
import { automatizacionesRouter } from "./modulos/automatizaciones/rutas.js";
import { destinosRouter } from "./modulos/destinos/rutas.js";
import { flujosRouter } from "./modulos/flujos/rutas.js";
import { qlikAutomatizacionesRouter } from "./modulos/qlik-automatizaciones/rutas.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware global: registra method, path (sin query), status y durationMs
app.use("*", async (c, next) => {
  const inicio = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  await next();
  const durationMs = Date.now() - inicio;
  const status = c.res.status;
  console.info(JSON.stringify({ method, path, status, durationMs }));
});

app.get("/api/salud", (c) => {
  return c.json({
    success: true,
    data: { estado: "ok", fecha: new Date().toISOString() },
  });
});

app.route("/api/auth/qlik", autenticacionQlikRouter);
app.route("/api/flujos", flujosRouter);
app.route("/api/automatizaciones", automatizacionesRouter);
app.route("/api/qlik/automatizaciones", qlikAutomatizacionesRouter);
app.route("/api/destinos", destinosRouter);

app.notFound((c) => {
  return c.json({ success: false, error: "No encontrado" }, 404);
});

app.onError((err, c) => {
  console.error(err);
  return new Response(
    JSON.stringify({ success: false, error: "Error interno" }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    },
  );
});
