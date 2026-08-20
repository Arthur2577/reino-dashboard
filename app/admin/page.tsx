import Link from "next/link";
import { getAdminDashboardData } from "@/lib/admin-data";
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
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8 relative z-10">

        {/* 👑 HEADER ADMIN - MELHORADO */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 blur-2xl rounded-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-xl">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">⚙️ Painel Administrativo</span>
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent mt-1">
                Dashboard do Bot
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs font-semibold text-gray-300 bg-gradient-to-r from-gray-600/20 to-gray-600/10 border border-gray-600/40 rounded-lg hover:from-gray-600/30 hover:to-gray-600/20 transition duration-300"
              >
                👤 Meu Painel
              </Link>
              <Link
                href="/admin/guilds"
                className="px-4 py-2 text-xs font-semibold text-blue-400 bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/40 rounded-lg hover:from-blue-500/30 hover:to-blue-500/20 transition duration-300"
              >
                🖥️ Servidores
              </Link>
            </div>
          </div>
        </div>

        {/* 📊 STAT CARDS - MELHORADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-br from-purple-950/40 to-slate-900/60 border border-purple-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-purple-500/50 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-300 uppercase font-semibold tracking-wider">👥 Total de Jogadores</p>
                  <p className="text-4xl font-black text-purple-400 mt-2">{totalUsers}</p>
                </div>
                <div className="text-4xl opacity-30">👥</div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-blue-500/50 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase font-semibold tracking-wider">🖥️ Servidores</p>
                  <p className="text-4xl font-black text-blue-400 mt-2">{totalGuilds}</p>
                </div>
                <div className="text-4xl opacity-30">🖥️</div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm hover:border-emerald-500/50 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-300 uppercase font-semibold tracking-wider">📡 Status BD</p>
                  <p className="text-4xl font-black text-emerald-400 mt-2">✅ Online</p>
                </div>
                <div className="text-4xl opacity-30">📡</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔍 SEARCH BAR - MELHORADO */}
        <div className="relative">
          <PlayerSearchBar query={q} />
        </div>

        {/* 📈 GRID COM TABELAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingTable realms={realms} profilesById={profilesById} />
          <RecentUsersList users={users} />
        </div>
      </div>
    </main>
  );
}