import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerDetail } from "@/lib/admin-data";
import { updateRealm, resetCooldowns } from "@/lib/admin-actions";
import { UserAvatar } from "@/components/UserAvatar";

function formatBigInt(value: bigint | null | undefined) {
  return value !== null && value !== undefined ? value.toString() : "0";
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { user, realm } = await getPlayerDetail(userId);

  if (!user) {
    notFound();
  }

  const updateRealmWithId = updateRealm.bind(null, userId);
  const resetCooldownsWithId = resetCooldowns.bind(null, userId);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-5xl space-y-8 relative z-10">

        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10 blur-2xl rounded-3xl" />
          <div className="relative flex items-center justify-between gap-6 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full blur opacity-60" />
                <UserAvatar avatarUrl={user.avatar} username={user.username} size="lg" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{user.username}</h1>
                <p className="font-mono text-xs text-gray-400 mt-1">{user.user_id}</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-gradient-to-r from-slate-700/30 to-slate-700/10 border border-slate-600/40 rounded-lg hover:from-slate-700/40 hover:to-slate-700/20 transition duration-300"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {!realm ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-indigo-500/20 p-10 rounded-3xl text-center space-y-4 backdrop-blur-sm">
              <div className="text-5xl">🏰</div>
              <h2 className="text-2xl font-bold text-white">Nenhum Reino</h2>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Esse jogador ainda não fundou um reino. Ele precisa criar um no Discord primeiro.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Editar Reino */}
            <div className="bg-gradient-to-br from-amber-950/30 to-slate-900/60 border border-amber-500/30 p-6 rounded-2xl backdrop-blur-sm shadow-lg space-y-6">
              <div>
                <h3 className="text-lg font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  ✏️ Editar Reino
                </h3>
              </div>

              <form action={updateRealmWithId} className="space-y-4">
                {/* Ouro */}
                <div>
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                    💰 Ouro Livre
                  </label>
                  <input
                    type="number"
                    name="gold"
                    defaultValue={formatBigInt(realm.gold)}
                    className="w-full rounded-lg border border-amber-500/30 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition"
                  />
                </div>

                {/* Cofre Seguro */}
                <div>
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-2">
                    🏛️ Cofre Seguro
                  </label>
                  <input
                    type="number"
                    name="safe_vault"
                    defaultValue={formatBigInt(realm.safe_vault)}
                    className="w-full rounded-lg border border-blue-500/30 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>

                {/* Poder Militar */}
                <div>
                  <label className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-2">
                    ⚔️ Poder do Exército
                  </label>
                  <input
                    type="number"
                    name="army_power"
                    defaultValue={realm.army_power ?? 0}
                    className="w-full rounded-lg border border-red-500/30 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500/60 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition"
                  />
                </div>

                {/* Níveis */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-2">
                      🧱 Muralha
                    </label>
                    <input
                      type="number"
                      name="wall_level"
                      defaultValue={realm.wall_level ?? 1}
                      className="w-full rounded-lg border border-emerald-500/30 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-2">
                      🗝️ Cofre
                    </label>
                    <input
                      type="number"
                      name="vault_level"
                      defaultValue={realm.vault_level ?? 1}
                      className="w-full rounded-lg border border-emerald-500/30 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 rounded-lg bg-gradient-to-r from-amber-500/80 to-yellow-500/80 hover:from-amber-500 hover:to-yellow-500 px-4 py-3 text-sm font-bold text-white transition duration-300 shadow-lg shadow-amber-500/20"
                >
                  💾 Salvar Alterações
                </button>
              </form>
            </div>

            {/* Cooldowns */}
            <div className="bg-gradient-to-br from-red-950/30 to-slate-900/60 border border-red-500/30 p-6 rounded-2xl backdrop-blur-sm shadow-lg space-y-6">
              <div>
                <h3 className="text-lg font-black bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent">
                  ⏳ Gerenciar Cooldowns
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Se o jogador reportar que um comando está travado sem motivo, você pode liberar todos os cooldowns aqui.
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-bold text-red-300 uppercase tracking-wider">⚠️ Aviso</p>
                  <p className="text-xs text-red-200">Esta ação irá resetar todos os timers do jogador imediatamente.</p>
                </div>

                <form action={resetCooldownsWithId}>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-red-600/80 to-orange-600/80 hover:from-red-600 hover:to-orange-600 px-4 py-3 text-sm font-bold text-white transition duration-300 shadow-lg shadow-red-500/20"
                  >
                    🔄 Resetar Todos os Cooldowns
                  </button>
                </form>
              </div>

              {/* Stats do Reino */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 space-y-3">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">📊 Informações</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Ouro Livre:</span>
                    <p className="font-bold text-amber-400">{Number(realm.gold ?? 0).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Cofre:</span>
                    <p className="font-bold text-blue-400">{Number(realm.safe_vault ?? 0).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Exército:</span>
                    <p className="font-bold text-red-400">{realm.army_power ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Fortificação:</span>
                    <p className="font-bold text-emerald-400">Nv. {((realm.wall_level ?? 1) + (realm.vault_level ?? 1)) / 2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
