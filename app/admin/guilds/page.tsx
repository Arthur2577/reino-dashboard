import Link from "next/link";
import { getGuildSettings } from "@/lib/admin-data";
import { Card } from "@/components/Card";

export default async function GuildsPage() {
  const guilds = await getGuildSettings();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-5xl space-y-8 relative z-10">

        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 blur-2xl rounded-3xl" />
          <div className="relative flex flex-col gap-4 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-blue-500/20 p-6 rounded-3xl backdrop-blur-xl">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">🖥️ Gerenciamento</span>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent mt-1">
                Servidores Configurados
              </h1>
            </div>
            <Link
              href="/admin"
              className="w-fit px-4 py-2 text-xs font-semibold text-slate-300 bg-gradient-to-r from-slate-700/30 to-slate-700/10 border border-slate-600/40 rounded-lg hover:from-slate-700/40 hover:to-slate-700/20 transition duration-300"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>

        {/* Guilds Table */}
        {guilds.length === 0 ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-blue-500/20 p-10 rounded-3xl text-center space-y-4 backdrop-blur-sm">
              <div className="text-5xl">🖥️</div>
              <h2 className="text-2xl font-bold text-white">Nenhum Servidor</h2>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Nenhum servidor Discord foi configurado ainda. Configure o bot em seus servidores para vê-los aqui.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-blue-500/20 rounded-3xl overflow-hidden backdrop-blur-sm shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-950/50 to-slate-900/50 border-b border-blue-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-300">
                      🖥️ ID do Servidor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-300">
                      📢 Canal de Conflitos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {guilds.map((guild) => (
                    <tr key={guild.guild_id} className="hover:bg-blue-500/10 transition duration-300">
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono text-gray-300 bg-slate-800/50 px-2 py-1 rounded">
                          {guild.guild_id}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {guild.conflict_log_channel_id ? (
                          <code className="text-xs font-mono text-gray-300 bg-slate-800/50 px-2 py-1 rounded">
                            {guild.conflict_log_channel_id}
                          </code>
                        ) : (
                          <span className="text-xs text-gray-500 italic">Não configurado</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                          🟢 Ativo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        {guilds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/30 p-4 rounded-2xl backdrop-blur-sm hover:border-blue-500/50 transition duration-300">
                <p className="text-xs text-blue-300 uppercase font-semibold">📊 Total de Servidores</p>
                <p className="text-3xl font-black text-blue-400 mt-2">{guilds.length}</p>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition duration-300">
                <p className="text-xs text-emerald-300 uppercase font-semibold">✅ Configurados</p>
                <p className="text-3xl font-black text-emerald-400 mt-2">
                  {guilds.filter((g) => g.conflict_log_channel_id).length}/{guilds.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
