import { Button } from "@/compartido/componentes/ui/button";

export function EstadoLayout({ mensaje }: { mensaje: string }) {
  return (
    <div className="ambient flex min-h-screen items-center justify-center bg-app px-4">
      <p className="text-ink-500" aria-live="polite">
        {mensaje}
      </p>
    </div>
  );
}

export function ErrorSesionLayout({
  error,
  onReintentar,
  onLogin,
}: {
  error: unknown;
  onReintentar: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="ambient flex min-h-screen items-center justify-center bg-app px-4">
      <div
        className="max-w-md rounded-lg border border-danger-200 bg-surface p-6 text-center shadow-card"
        role="alert"
      >
        <h1 className="font-semibold text-ink-900">
          No pudimos verificar tu sesión
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {error instanceof Error ? error.message : "Intenta nuevamente."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={onReintentar}>
            Reintentar
          </Button>
          <Button onClick={onLogin}>Ir al inicio de sesión</Button>
        </div>
      </div>
    </div>
  );
}
