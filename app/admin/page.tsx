import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/admin-data";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { RankingTable } from "@/components/RankingTable";
import { RecentUsersList } from "@/components/RecentUsersList";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!isAdmin(session)) redirect("/dashboard");

  const { totalUsers, totalGuilds, realms, users, profilesById } = await getAdminDashboardData();

  return (
    <main className="min-h-screen bg-background p-6 text-white md:p-10">
      <PageHeader eyebrow="Área restrita" title="Dashboard do Bot" />
          <Link href="/dashboard" className="mb-6 inline-block text-sm text-accent-text hover:underline">
        ← Ver meu painel de jogador
      </Link>
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
