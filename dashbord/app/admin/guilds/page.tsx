import Link from "next/link";
import { getGuildSettings } from "@/lib/admin-data";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";

export default async function GuildsPage() {
  const guilds = await getGuildSettings();

  return (
    <main className="min-h-screen bg-background p-6 text-white md:p-10">
      <PageHeader eyebrow="Área restrita" title="Servidores Configurados" />

      <Link href="/admin" className="mb-6 inline-block text-sm text-accent-text hover:underline">
        ← Voltar pro dashboard
      </Link>

      <Card>
        {guilds.length === 0 ? (
          <p className="text-text-secondary">Nenhum servidor configurado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-text-secondary">
                <tr>
                  <th className="pb-3">Guild ID</th>
                  <th className="pb-3">Canal de log de conflitos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {guilds.map((guild) => (
                  <tr key={guild.guild_id}>
                    <td className="py-3 font-mono text-xs">{guild.guild_id}</td>
                    <td className="py-3 font-mono text-xs text-text-secondary">
                      {guild.conflict_log_channel_id ?? "Não configurado"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}
