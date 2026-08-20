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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-red-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-red-400 rounded-3xl blur-lg opacity-60 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-950/80 to-red-950/80 text-5xl font-extrabold shadow-2xl backdrop-blur-xl">
                ⚔️
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-red-400 bg-clip-text text-transparent">
              Reino
            </h1>
            <p className="text-sm text-gray-400 mt-1">Construa seu império</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="relative space-y-6 border border-amber-500/20 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-extrabold text-white">Bem-vindo ao Reino</h2>
            <p className="text-sm leading-relaxed text-gray-300">
              Conecte sua conta do Discord para construir seu reino, dominar o ranking e participar de épicas batalhas.
            </p>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-2xl">🪙</div>
              <p className="text-[10px] font-semibold text-gray-300">Ouro</p>
              <p className="text-[9px] text-gray-500">Acumule</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="text-2xl">⚔️</div>
              <p className="text-[10px] font-semibold text-gray-300">Guerra</p>
              <p className="text-[9px] text-gray-500">Lutar</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="text-2xl">🏆</div>
              <p className="text-[10px] font-semibold text-gray-300">Ranking</p>
              <p className="text-[9px] text-gray-500">Competir</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Login Button */}
          <DiscordSignInButton />

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500">
            Ao entrar, você concorda com as <br />
            <span className="text-amber-400/80">regras do bot no servidor</span>
          </p>
        </Card>

        {/* Bottom Info */}
        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-gray-400">Jogar</p>
            <p className="font-semibold text-white">Discord Bot</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-gray-400">Acompanhar</p>
            <p className="font-semibold text-white">Seu Progresso</p>
          </div>
        </div>
      </div>
    </main>
  );
}