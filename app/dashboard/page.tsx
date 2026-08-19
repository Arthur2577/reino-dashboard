import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";
import { getUserRealm } from "@/lib/realm-data";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";

// Importe o Prisma Client do seu caminho gerado
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string } | undefined)?.id;
  const realm = userId ? await getUserRealm(userId) : null;

  // 1. Busca os 10 maiores reinos para o Ranking Lateral
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
      avatar: u?.avatar,
      gold: r.gold ? Number(r.gold) : 0,
      armyPower: r.army_power || 0,
    };
  });

  const now = Date.now();

  return (
    <main className="min-h-screen bg-background p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Painel do jogador" title="Seu Reino" />

        {isAdmin(session) && (
          <Link href="/admin" className="mb-6 inline-block text-sm text-accent-text hover:underline">
            ← Ir para o painel de admin
          </Link>
        )}

        {/* LAYOUT EM GRID (2 COLUNAS) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* COLUNA DA ESQUERDA: DADOS E STATUS DO JOGADOR */}
          <div className="lg:col-span-2">
            {realm ? (
              <>
                <h2 className="mb-4 text-xl font-bold">Olá, {session.user?.name ?? "jogador"}</h2>
                
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <StatCard
                    label="Ouro"
                    value={`${(realm.gold ?? BigInt(0)).toLocaleString("pt-BR")} 🪙`}
                    color="text-amber-400"
                  />
                  <StatCard
                    label="Cofre seguro"
                    value={`${(realm.safe_vault ?? BigInt(0)).toLocaleString("pt-BR")} 🪙`}
                  />
                  <StatCard label="Poder do exército" value={`${realm.army_power ?? 0} 🗡️`} />
                  <StatCard label="Nível da muralha" value={realm.wall_level ?? 1} />
                  <StatCard label="Nível do cofre" value={realm.vault_level ?? 1} />
                </section>

                {/* TIMERS DE COOLDOWN */}
                <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status de Ações
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-gray-800/60 p-3 border border-gray-800">
                      <span className="block text-gray-400 mb-1">Comando /trabalhar</span>
                      <strong className={Number(realm.work_cooldown_until ?? 0) > now ? "text-amber-400" : "text-emerald-400"}>
                        {Number(realm.work_cooldown_until ?? 0) > now ? "⏳ Em Cooldown" : "✅ Disponível"}
                      </strong>
                    </div>

                    <div className="rounded-lg bg-gray-800/60 p-3 border border-gray-800">
                      <span className="block text-gray-400 mb-1">Comando /atacar</span>
                      <strong className={Number(realm.attack_cooldown_until ?? 0) > now ? "text-amber-400" : "text-emerald-400"}>
                        {Number(realm.attack_cooldown_until ?? 0) > now ? "⏳ Em Cooldown" : "⚔️ Pronto"}
                      </strong>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <h2 className="text-xl font-bold">Você ainda não tem um reino</h2>
                <p className="mt-2 text-text-secondary">
                  Use o comando do bot no Discord para fundar seu reino e começar a jogar.
                </p>
              </Card>
            )}
          </div>

          {/* COLUNA DA DIREITA: TOP RANKING */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 h-fit">
            <h3 className="mb-4 text-base font-bold flex justify-between items-center border-b border-gray-800 pb-2">
              <span>🏆 Top 10 Reinos</span>
              <span className="text-xs font-normal text-gray-400">Ouro</span>
            </h3>

            <div className="space-y-3">
              {ranking.length > 0 ? (
                ranking.map((player, idx) => (
                  <div
                    key={player.userId}
                    className="flex items-center justify-between rounded-lg bg-gray-800/40 p-2.5 text-xs border border-gray-800/80 hover:bg-gray-800/80 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-black text-xs w-4 text-center ${
                          idx === 0
                            ? "text-amber-400"
                            : idx === 1
                            ? "text-gray-300"
                            : idx === 2
                            ? "text-amber-600"
                            : "text-gray-500"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-200">{player.username}</p>
                        <p className="text-[10px] text-gray-400">⚔️ {player.armyPower} Poder</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-400">
                      {player.gold.toLocaleString("pt-BR")} 🪙
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">Nenhum reino cadastrado.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}