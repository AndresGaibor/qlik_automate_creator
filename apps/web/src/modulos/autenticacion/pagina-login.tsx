import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { useMutation } from "@tanstack/react-query";

export function PaginaLogin() {
  const { mutate: iniciarOAuth, isPending } = useMutation({
    mutationFn: async () => {
      window.location.href = "/api/auth/qlik/iniciar";
    },
    onError: () => {
      window.location.href = "/api/auth/qlik/iniciar";
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    iniciarOAuth();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Esta aplicación usa autenticación OAuth de Qlik. Inicia sesión con tu cuenta de Qlik Cloud.
          </p>
          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Redirigiendo..." : "Iniciar sesión con Qlik"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
