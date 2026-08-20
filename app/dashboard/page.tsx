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

  // 🏆 RANKINGS DIFERENTES
  const buildRanking = (field: string) => {
    const sorted = [...topRealms]
      .sort((a, b) => {
        const aVal = field === "gold" ? Number(a.gold ?? 0) : 
                    field === "army" ? Number(a.army_power ?? 0) :
                    field === "vault" ? Number(a.safe_vault ?? 0) :
                    (a.wall_level ?? 1) + (a.vault_level ?? 1);
        const bVal = field === "gold" ? Number(b.gold ?? 0) :
                    field === "army" ? Number(b.army_power ?? 0) :
                    field === "vault" ? Number(b.safe_vault ?? 0) :
                    (b.wall_level ?? 1) + (b.vault_level ?? 1);
        return bVal - aVal;
      })
      .slice(0, 5)
      .map((r) => {
        const u = usersData.find((user) => user.user_id === r.user_id);
        return {
          userId: r.user_id,
          username: u?.username || "Rei Desconhecido",
          avatar: u?.avatar || null,
          gold: r.gold !== null && r.gold !== undefined ? Number(r.gold) : 0,
          armyPower: r.army_power || 0,
          safeVault: r.safe_vault !== null && r.safe_vault !== undefined ? Number(r.safe_vault) : 0,
          fortificacao: (r.wall_level ?? 1) + (r.vault_level ?? 1),
        };
      });
    return sorted;
  };

  const rankingGold = buildRanking("gold");
  const rankingArmy = buildRanking("army");
  const rankingVault = buildRanking("vault");
  const rankingFortificacao = buildRanking("fort");

  const now = Date.now();

  // Tratamento seguro de BigInt para exibição na tela
  const goldValue = realm?.gold !== null && realm?.gold !== undefined ? Number(realm.gold) : 0;
  const safeVaultValue = realm?.safe_vault !== null && realm?.safe_vault !== undefined ? Number(realm.safe_vault) : 0;
  const workCooldown = realm?.work_cooldown_until !== null && realm?.work_cooldown_until !== undefined ? Number(realm.work_cooldown_until) : 0;
  const attackCooldown = realm?.attack_cooldown_until !== null && realm?.attack_cooldown_until !== undefined ? Number(realm.attack_cooldown_until) : 0;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-red-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8 relative z-10">

        {/* 👑 HEADER DO REINO - MELHORADO */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10 blur-2xl rounded-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-amber-500/20 p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-red-400 rounded-full blur opacity-60" />
                {session?.user?.image ? (
                  <img
                    src={session?.user?.image ?? ""}
                    alt={session?.user?.name || "Avatar"}
                    className="relative w-16 h-16 rounded-full border-2 border-amber-400/60 shadow-lg shadow-amber-500/20 object-cover"
                  />
                ) : (
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-2xl font-bold text-black border-2 border-amber-300 shadow-lg">
                    🏰
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">Seu Império</span>
                <h1 className="text-3xl font-black bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">
                  {session?.user?.name ?? "Rei"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isAdmin(session) && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-xs font-semibold text-amber-400 bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-lg hover:from-amber-500/30 hover:to-amber-500/20 transition duration-300 shadow-lg shadow-amber-500/10"
                >
                  ⚙️ Admin
                </Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-red-400 bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/40 rounded-lg hover:from-red-500/30 hover:to-red-500/20 transition duration-300 cursor-pointer shadow-lg shadow-red-500/10"
                >
                  🚪 Sair
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 📐 GRID PRINCIPAL EM 2 COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ⚔️ COLUNA ESQUERDA: STATUS DO JOGADOR */}
          <div className="lg:col-span-2 space-y-6">
            
            {realm ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-amber-400 to-red-400 rounded-full" />
                  <h2 className="text-lg font-bold text-white">📊 Status da sua Província</h2>
                </div>

                {/* Grid de Cards dos Atributos - MELHORADO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ouro */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-br from-amber-950/40 to-slate-900/60 border border-amber-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-amber-500/50 transition duration-300 h-full">
                      <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">💰 Ouro Livre</span>
                      <p className="text-4xl font-black text-amber-400 mt-3">
                        {goldValue.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-2">💵 Disponível para saques</p>
                    </div>
                  </div>

                  {/* Cofre Seguro */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-blue-500/50 transition duration-300 h-full">
                      <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">🏛️ Cofre Seguro</span>
                      <p className="text-4xl font-black text-blue-400 mt-3">
                        {safeVaultValue.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-2">🔒 Protegido contra ataques</p>
                    </div>
                  </div>

                  {/* Poder Militar */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-br from-red-950/40 to-slate-900/60 border border-red-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-red-500/50 transition duration-300 h-full">
                      <span className="text-xs font-semibold text-red-300 uppercase tracking-widest">⚔️ Poder Militar</span>
                      <p className="text-4xl font-black text-red-400 mt-3">
                        {realm.army_power ?? 0}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-2">🎖️ Força ofensiva</p>
                    </div>
                  </div>

                  {/* Estruturas */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-emerald-500/50 transition duration-300 h-full flex flex-col justify-between">
                      <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">🧱 Fortificações</span>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center bg-emerald-500/10 p-2 rounded-lg">
                          <span className="text-sm text-gray-300">Muralha</span>
                          <strong className="text-emerald-400 font-bold">Nv. {realm.wall_level ?? 1}</strong>
                        </div>
                        <div className="flex justify-between items-center bg-emerald-500/10 p-2 rounded-lg">
                          <span className="text-sm text-gray-300">Cofre</span>
                          <strong className="text-emerald-400 font-bold">Nv. {realm.vault_level ?? 1}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ⏳ TIMERS E STATUS - MELHORADO */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                      ⏳ Ações Disponíveis
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Cooldown Trabalhar */}
                    <div className="bg-gradient-to-br from-amber-900/20 to-slate-900/40 border border-amber-500/20 p-4 rounded-xl hover:border-amber-500/40 transition duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-amber-300 block font-semibold">/trabalhar</span>
                          <span className="text-xs text-gray-300 font-medium mt-1">Coletar Recursos</span>
                        </div>
                        {workCooldown > now ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                            ⏳ Aguarde
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30 animate-pulse">
                            ✅ Pronto
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cooldown Atacar */}
                    <div className="bg-gradient-to-br from-red-900/20 to-slate-900/40 border border-red-500/20 p-4 rounded-xl hover:border-red-500/40 transition duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-red-300 block font-semibold">/atacar</span>
                          <span className="text-xs text-gray-300 font-medium mt-1">Ataque Estratégico</span>
                        </div>
                        {attackCooldown > now ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                            ⏳ Aguarde
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30 animate-pulse">
                            ⚔️ Pronto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-red-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-amber-500/20 p-10 rounded-3xl text-center space-y-4 backdrop-blur-sm">
                  <div className="text-5xl">🏰</div>
                  <h2 className="text-2xl font-bold text-white">Funde seu Reino</h2>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Entre no servidor Discord e use o comando <code className="bg-slate-800 px-2 py-1 rounded text-amber-400">/criar</code> para fundadar seu império!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 🏆 COLUNA DIREITA: RANKINGS */}
          <div className="space-y-6">
            
            {/* 💰 RANKING POR OURO */}
            <div className="group bg-gradient-to-br from-amber-950/30 to-slate-900/60 border border-amber-500/30 p-6 rounded-2xl space-y-4 backdrop-blur-sm hover:border-amber-500/50 transition duration-300 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  💰 Top Riqueza
                </h3>
                <span className="text-[9px] uppercase font-semibold text-amber-400 bg-amber-500/30 px-2 py-1 rounded-full border border-amber-500/50">
                  🥇 Ouro
                </span>
              </div>
              <div className="space-y-2">
                {rankingGold.length > 0 ? (
                  rankingGold.map((player, idx) => {
                    const avatarUrl = player.avatar
                      ? `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png`
                      : null;
                    const medalColors = idx === 0 ? "from-yellow-400/20 to-yellow-400/5 border-yellow-500/30" : idx === 1 ? "from-gray-400/10 to-gray-400/5 border-gray-500/20" : idx === 2 ? "from-amber-600/15 to-amber-600/5 border-amber-500/20" : "from-slate-700/20 to-slate-800/20 border-slate-600/20";
                    return (
                      <div key={player.userId} className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${medalColors} hover:scale-105 transition duration-200 cursor-pointer`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`font-black text-sm w-6 text-center ${idx === 0 ? "text-yellow-400 text-base" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-amber-600" : "text-gray-500"}`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "#" + (idx + 1)}
                          </span>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={player.username} className="w-7 h-7 rounded-full border-2 border-amber-400/50 object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-600/50 flex items-center justify-center text-[10px] font-bold text-amber-100">{player.username.charAt(0)}</div>
                          )}
                          <p className="text-sm font-semibold text-gray-100 truncate">{player.username}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-400 whitespace-nowrap ml-2">{(player.gold / 1000).toFixed(0)}k 💰</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 text-center py-3">Nenhum reino</p>
                )}
              </div>
            </div>

            {/* ⚔️ RANKING POR PODER MILITAR */}
            <div className="group bg-gradient-to-br from-red-950/30 to-slate-900/60 border border-red-500/30 p-6 rounded-2xl space-y-4 backdrop-blur-sm hover:border-red-500/50 transition duration-300 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  ⚔️ Top Guerreiros
                </h3>
                <span className="text-[9px] uppercase font-semibold text-red-400 bg-red-500/30 px-2 py-1 rounded-full border border-red-500/50">
                  💪 Exército
                </span>
              </div>
              <div className="space-y-2">
                {rankingArmy.length > 0 ? (
                  rankingArmy.map((player, idx) => {
                    const avatarUrl = player.avatar
                      ? `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png`
                      : null;
                    const medalColors = idx === 0 ? "from-red-400/20 to-red-400/5 border-red-500/30" : idx === 1 ? "from-gray-400/10 to-gray-400/5 border-gray-500/20" : idx === 2 ? "from-red-600/15 to-red-600/5 border-red-500/20" : "from-slate-700/20 to-slate-800/20 border-slate-600/20";
                    return (
                      <div key={player.userId} className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${medalColors} hover:scale-105 transition duration-200 cursor-pointer`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`font-black text-sm w-6 text-center ${idx === 0 ? "text-red-400 text-base" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-red-600" : "text-gray-500"}`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "#" + (idx + 1)}
                          </span>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={player.username} className="w-7 h-7 rounded-full border-2 border-red-400/50 object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-red-600/50 flex items-center justify-center text-[10px] font-bold text-red-100">{player.username.charAt(0)}</div>
                          )}
                          <p className="text-sm font-semibold text-gray-100 truncate">{player.username}</p>
                        </div>
                        <span className="text-xs font-bold text-red-400 whitespace-nowrap ml-2">{player.armyPower.toLocaleString("pt-BR")} 🎖️</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 text-center py-3">Nenhum reino</p>
                )}
              </div>
            </div>

            {/* 🏛️ RANKING POR COFRE SEGURO */}
            <div className="group bg-gradient-to-br from-blue-950/30 to-slate-900/60 border border-blue-500/30 p-6 rounded-2xl space-y-4 backdrop-blur-sm hover:border-blue-500/50 transition duration-300 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  🏛️ Top Segurança
                </h3>
                <span className="text-[9px] uppercase font-semibold text-blue-400 bg-blue-500/30 px-2 py-1 rounded-full border border-blue-500/50">
                  🔐 Cofre
                </span>
              </div>
              <div className="space-y-2">
                {rankingVault.length > 0 ? (
                  rankingVault.map((player, idx) => {
                    const avatarUrl = player.avatar
                      ? `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png`
                      : null;
                    const medalColors = idx === 0 ? "from-blue-400/20 to-blue-400/5 border-blue-500/30" : idx === 1 ? "from-gray-400/10 to-gray-400/5 border-gray-500/20" : idx === 2 ? "from-blue-600/15 to-blue-600/5 border-blue-500/20" : "from-slate-700/20 to-slate-800/20 border-slate-600/20";
                    return (
                      <div key={player.userId} className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${medalColors} hover:scale-105 transition duration-200 cursor-pointer`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`font-black text-sm w-6 text-center ${idx === 0 ? "text-blue-400 text-base" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-blue-600" : "text-gray-500"}`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "#" + (idx + 1)}
                          </span>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={player.username} className="w-7 h-7 rounded-full border-2 border-blue-400/50 object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-600/50 flex items-center justify-center text-[10px] font-bold text-blue-100">{player.username.charAt(0)}</div>
                          )}
                          <p className="text-sm font-semibold text-gray-100 truncate">{player.username}</p>
                        </div>
                        <span className="text-xs font-bold text-blue-400 whitespace-nowrap ml-2">{(player.safeVault / 1000).toFixed(0)}k 🏛️</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 text-center py-3">Nenhum reino</p>
                )}
              </div>
            </div>

            {/* 🧱 RANKING POR FORTIFICAÇÕES */}
            <div className="group bg-gradient-to-br from-emerald-950/30 to-slate-900/60 border border-emerald-500/30 p-6 rounded-2xl space-y-4 backdrop-blur-sm hover:border-emerald-500/50 transition duration-300 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  🧱 Top Construtor
                </h3>
                <span className="text-[9px] uppercase font-semibold text-emerald-400 bg-emerald-500/30 px-2 py-1 rounded-full border border-emerald-500/50">
                  🏗️ Nível
                </span>
              </div>
              <div className="space-y-2">
                {rankingFortificacao.length > 0 ? (
                  rankingFortificacao.map((player, idx) => {
                    const avatarUrl = player.avatar
                      ? `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png`
                      : null;
                    const medalColors = idx === 0 ? "from-emerald-400/20 to-emerald-400/5 border-emerald-500/30" : idx === 1 ? "from-gray-400/10 to-gray-400/5 border-gray-500/20" : idx === 2 ? "from-emerald-600/15 to-emerald-600/5 border-emerald-500/20" : "from-slate-700/20 to-slate-800/20 border-slate-600/20";
                    return (
                      <div key={player.userId} className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${medalColors} hover:scale-105 transition duration-200 cursor-pointer`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`font-black text-sm w-6 text-center ${idx === 0 ? "text-emerald-400 text-base" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-emerald-600" : "text-gray-500"}`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "#" + (idx + 1)}
                          </span>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={player.username} className="w-7 h-7 rounded-full border-2 border-emerald-400/50 object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-600/50 flex items-center justify-center text-[10px] font-bold text-emerald-100">{player.username.charAt(0)}</div>
                          )}
                          <p className="text-sm font-semibold text-gray-100 truncate">{player.username}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 whitespace-nowrap ml-2">Nv. {player.fortificacao}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 text-center py-3">Nenhum reino</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}