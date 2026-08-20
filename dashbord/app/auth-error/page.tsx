import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthCallback: "Não foi possível confirmar sua conta do Discord. Tente novamente.",
  AccessDenied: "Você cancelou o login ou não tem permissão para entrar.",
  Configuration: "Há um problema na configuração do servidor. Avise um administrador.",
  Default: "Algo deu errado ao tentar fazer login. Tente novamente.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = ERROR_MESSAGES[error ?? "Default"] ?? ERROR_MESSAGES.Default;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-white">
      <Card className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-3xl">
          ⚠️
        </div>
        <h1 className="mb-2 text-2xl font-extrabold">Não deu pra entrar</h1>
        <p className="mb-8 text-sm leading-relaxed text-text-secondary">{message}</p>
        <Button href="/login" className="w-full">
          Tentar de novo
        </Button>
      </Card>
    </main>
  );
}
