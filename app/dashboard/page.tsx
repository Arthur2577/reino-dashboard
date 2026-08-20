import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions, isAdmin } from "@/lib/auth";
import { getUserRealm } from "@/lib/realm-data";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const userId = (session?.user as { id?: string } | undefined)?.id;
  const realm = userId ? await getUserRealm(userId) : null;

  // 🏆 1. BUSCA O TOP 10 NO BANCO PARA A COLUNA DA DIREITA
  const topRealms = await prisma.realms.findMany({
    take: 10,
    orderBy: { gold: "desc" },
  });

  const userIds = topRealms.map((r) => r.user_id);
  const usersData = await prisma.users.findMany({
    where: { user_id: { in: userIds } },
    select: { user_id: true, username: true, avatar: true },
  });

  const ranking = topRealms.map((r) => {
    const u = usersData.find((user) => user.user_id === r.user_id);
    return {
      userId: r.user_id,
      username: u?.username || "Rei Desconhecido",
      avatar: u?.avatar || null,
      gold: r.gold !== null && r.gold !== undefined ? Number(r.gold) : 0,
      armyPower: r.army_power || 0,
    };
  });

  const now = Date.now();

  // Tratamento seguro de BigInt para exibição na tela
  const goldValue = realm?.gold !== null && realm?.gold !== undefined ? Number(realm.gold) : 0;
  const safeVaultValue = realm?.safe_vault !== null && realm?.safe_vault !== undefined ? Number(realm.safe_vault) : 0;
  const workCooldown = realm?.work_cooldown_until !== null && realm?.work_cooldown_until !== undefined ? Number(realm.work_cooldown_until) : 0;
  const attackCooldown = realm?.attack_cooldown_until !== null && realm?.attack_cooldown_until !== undefined ? Number(realm.attack_cooldown_until) : 0;

  return (
    <main className="min-h-screen bg-[#0b0d10] text-gray-100 p-4 md:p-10 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* 👑 HEADER DO REINO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img
                src={session?.user?.image ?? ""}
                alt={session?.user?.name || "Avatar"}
                className="w-14 h-14 rounded-full border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-xl font-bold text-black border-2 border-amber-300">
                🏰
              </div>
            )}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Painel do Jogador
              </span>
              <h1 className="text-2xl font-black text-white">
                Reino de {session?.user?.name ?? "Rei"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin(session) && (
              <Link
                href="/admin"
                className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition"
              >
                ⚙️ Painel Admin
              </Link>
            )}

            {/* 🚪 BOTÃO DE LOGOUT (Feito com a rota oficial de encerramento do NextAuth) */}
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition cursor-pointer"
              >
                🚪 Sair
              </button>
            </form>
          </div>
        </div>

        {/* 📐 GRID PRINCIPAL EM 2 COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ⚔️ COLUNA ESQUERDA: STATUS DO JOGADOR */}
          <div className="lg:col-span-2 space-y-6">
            
            {realm ? (
              <>
                <h2 className="text-base font-bold text-gray-300 flex items-center gap-2">
                  📊 Status da sua Província
                </h2>

                {/* Grid de Cards dos Atributos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ouro */}
                  <div className="bg-gradient-to-br from-amber-950/30 to-gray-900 border border-amber-500/20 p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">Ouro Livre</span>
                    <p className="text-3xl font-black text-amber-400 mt-2 flex items-center gap-2">
                      {goldValue.toLocaleString("pt-BR")} <span className="text-xl">🪙</span>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-2">Disponível para saques e melhorias</p>
                  </div>

                  {/* Cofre Seguro */}
                  <div className="bg-gradient-to-br from-blue-950/30 to-gray-900 border border-blue-500/20 p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-medium text-blue-400/80 uppercase tracking-wider">Cofre Seguro</span>
                    <p className="text-3xl font-black text-blue-400 mt-2 flex items-center gap-2">
                      {safeVaultValue.toLocaleString("pt-BR")} <span className="text-xl">🏛️</span>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-2">Protegido contra saques de inimigos</p>
                  </div>

                  {/* Poder Militar */}
                  <div className="bg-gradient-to-br from-red-950/30 to-gray-900 border border-red-500/20 p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-medium text-red-400/80 uppercase tracking-wider">Poder do Exército</span>
                    <p className="text-3xl font-black text-red-400 mt-2 flex items-center gap-2">
                      {realm.army_power ?? 0} <span className="text-xl">⚔️</span>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-2">Determina sua força ofensiva nas guerras</p>
                  </div>

                  {/* Estruturas */}
                  <div className="bg-gradient-to-br from-emerald-950/30 to-gray-900 border border-emerald-500/20 p-5 rounded-2xl shadow-md flex flex-col justify-between">
                    <span className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider">Fortificações</span>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Muralha:</span>
                        <strong className="text-emerald-400 font-bold">Nível {realm.wall_level ?? 1} 🧱</strong>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Cofre:</span>
                        <strong className="text-emerald-400 font-bold">Nível {realm.vault_level ?? 1} 🗝️</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ⏳ TIMERS E STATUS DE AÇÕES DO DISCORD */}
                <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Ações do Reino (Cooldowns)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Cooldown Trabalhar */}
                    <div className="bg-gray-800/40 border border-gray-700/50 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 block">Comando /trabalhar</span>
                        <span className="text-xs font-bold text-gray-200">Coleta de Recursos</span>
                      </div>
                      {workCooldown > now ? (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          ⏳ Aguardando
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          ✅ Liberado
                        </span>
                      )}
                    </div>

                    {/* Cooldown Atacar */}
                    <div className="bg-gray-800/40 border border-gray-700/50 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 block">Comando /atacar</span>
                        <span className="text-xs font-bold text-gray-200">Ataque a Reinos</span>
                      </div>
                      {attackCooldown > now ? (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          ⏳ Aguardando
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          ⚔️ Pronto
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center space-y-3">
                <h2 className="text-xl font-bold text-white">Você ainda não fundou um reino!</h2>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Entre no nosso servidor do Discord e digite o comando de início para criar seu império e acompanhar seu progresso por aqui.
                </p>
              </div>
            )}
          </div>

          {/* 🏆 COLUNA DIREITA: RANKING TOP 10 */}
          <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl h-fit space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                🏆 Top 10 Reinos
              </h3>
              <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Por Fortuna
              </span>
            </div>

            <div className="space-y-2.5">
              {ranking.length > 0 ? (
                ranking.map((player, idx) => {
                  const avatarUrl = player.avatar
                    ? `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png`
                    : null;

                  return (
                    <div
                      key={player.userId}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-800/40 border border-gray-800/80 hover:bg-gray-800/80 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-black text-xs w-5 text-center ${
                            idx === 0
                              ? "text-yellow-400 text-sm"
                              : idx === 1
                              ? "text-gray-300"
                              : idx === 2
                              ? "text-amber-600"
                              : "text-gray-600"
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        {/* 🖼️ AVATAR DO DISCORD NO RANKING */}
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={player.username}
                            className="w-7 h-7 rounded-full border border-gray-700 object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-300 border border-gray-600">
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-semibold text-gray-200">{player.username}</p>
                          <p className="text-[10px] text-gray-400">⚔️ {player.armyPower} Poder</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-400">
                        {player.gold.toLocaleString("pt-BR")} 🪙
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 text-center py-6">Nenhum reino no ranking.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}