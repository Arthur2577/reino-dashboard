import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";
import { Card } from "@/components/Card";
import { DiscordSignInButton } from "@/components/DiscordSignInButton";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(isAdmin(session) ? "/admin" : "/dashboard");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-white">
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
      <Card className="relative z-10 w-full max-w-md text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/30 bg-accent-soft text-3xl font-extrabold text-accent-text">
          ⚔️
        </div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Bem-vindo ao Reino</h1>
        <p className="mb-8 text-sm leading-relaxed text-text-secondary">
          Conecte sua conta do Discord para acessar seu reino e consultar o ranking.
        </p>
        <DiscordSignInButton />
        <p className="mt-6 text-xs text-text-muted">
          Ao entrar, você concorda com as regras do bot no servidor.
        </p>
      </Card>
    </main>
  );
}