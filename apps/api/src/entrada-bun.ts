import { app } from "./app";

const puerto = Number(process.env.PORT ?? 3000);

Bun.serve({
  fetch: app.fetch,
  port: puerto,
});

console.log(`API ejecutándose en el puerto ${puerto}`);
