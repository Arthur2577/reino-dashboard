import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";
import { getUserRealm } from "@/lib/realm-data";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string } | undefined)?.id;
  const realm = userId ? await getUserRealm(userId) : null;

  return (
    <main className="min-h-screen bg-background p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        <PageHeader eyebrow="Painel do jogador" title="Seu Reino" />

        {isAdmin(session) && (
          <Link href="/admin" className="mb-6 inline-block text-sm text-accent-text hover:underline">
            ← Ir para o painel de admin
          </Link>
        )}

        {realm ? (
          <>
            <h2 className="mb-4 text-xl font-bold">Olá, {session.user?.name ?? "jogador"}</h2>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}