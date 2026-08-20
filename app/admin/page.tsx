import Link from "next/link";
import { getAdminDashboardData } from "@/lib/admin-data";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { RankingTable } from "@/components/RankingTable";
import { RecentUsersList } from "@/components/RecentUsersList";
import { PlayerSearchBar } from "@/components/PlayerSearchBar";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { totalUsers, totalGuilds, realms, users, profilesById } = await getAdminDashboardData();

  return (
    <main className="min-h-screen bg-background p-6 text-white md:p-10">
      <PageHeader eyebrow="Área restrita" title="Dashboard do Bot" />

      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-accent-text hover:underline">
          ← Ver meu painel de jogador
        </Link>
        <Link href="/admin/guilds" className="text-sm text-accent-text hover:underline">
          Ver servidores configurados →
        </Link>
      </div>

      <PlayerSearchBar query={q} />

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label="Total de jogadores" value={totalUsers} />
        <StatCard label="Servidores configurados" value={totalGuilds} color="text-accent-text" />
        <StatCard label="Status do banco" value="Conectado" color="text-emerald-400" />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RankingTable realms={realms} profilesById={profilesById} />
        <RecentUsersList users={users} />
      </div>
    </main>
  );
}