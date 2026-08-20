import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerDetail } from "@/lib/admin-data";
import { updateRealm, resetCooldowns } from "@/lib/admin-actions";
import { Card } from "@/components/Card";
import { UserAvatar } from "@/components/UserAvatar";
import { PageHeader } from "@/components/PageHeader";

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
    <main className="min-h-screen bg-background p-6 text-white md:p-10">
      <PageHeader eyebrow="Área restrita" title="Detalhe do Jogador" />

      <Link href="/admin" className="mb-6 inline-block text-sm text-accent-text hover:underline">
        ← Voltar pra busca
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <UserAvatar avatarUrl={user.avatar} username={user.username} />
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="font-mono text-xs text-text-muted">{user.user_id}</p>
        </div>
      </div>

      {!realm ? (
        <Card>
          <p className="text-text-secondary">Esse jogador ainda não fundou um reino.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 text-lg font-bold">Editar reino</h3>
            <form action={updateRealmWithId} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase text-text-secondary">Ouro</label>
                <input
                  type="number"
                  name="gold"
                  defaultValue={formatBigInt(realm.gold)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase text-text-secondary">Cofre seguro</label>
                <input
                  type="number"
                  name="safe_vault"
                  defaultValue={formatBigInt(realm.safe_vault)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase text-text-secondary">Poder do exército</label>
                <input
                  type="number"
                  name="army_power"
                  defaultValue={realm.army_power ?? 0}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs uppercase text-text-secondary">Nível da muralha</label>
                  <input
                    type="number"
                    name="wall_level"
                    defaultValue={realm.wall_level ?? 1}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase text-text-secondary">Nível do cofre</label>
                  <input
                    type="number"
                    name="vault_level"
                    defaultValue={realm.vault_level ?? 1}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Salvar alterações
              </button>
            </form>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-bold">Cooldowns</h3>
            <p className="mb-4 text-sm text-text-secondary">
              Se o jogador reportar que um comando está travado sem motivo, você pode liberar tudo de uma vez.
            </p>
            <form action={resetCooldownsWithId}>
              <button
                type="submit"
                className="w-full rounded-xl border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm font-semibold text-warning transition-colors hover:bg-warning/20"
              >
                Resetar todos os cooldowns
              </button>
            </form>
          </Card>
        </div>
      )}
    </main>
  );
}
