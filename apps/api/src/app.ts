import { Hono } from "hono";
import { cors } from "hono/cors";

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

app.notFound((c) => {
  return c.json({ success: false, error: "No encontrado" }, 404);
});

app.onError((c, err) => {
  console.error(err);
  return c.json({ success: false, error: "Error interno" }, 500);
});
