import { UserAvatar } from "./UserAvatar";
import { Card } from "./Card";

const MEDALS = ["🥇", "🥈", "🥉"];

type RankingEntry = {
  user_id: string;
  gold: bigint | null;
  army_power: number | null;
};

type Profile = {
  user_id: string;
  username: string | null;
  avatar: string | null;
};

type RankingTableProps = {
  realms: RankingEntry[];
  profilesById: Map<string, Profile>;
};

export function RankingTable({ realms, profilesById }: RankingTableProps) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">⚔️ Ranking por ouro</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-text-secondary">
            <tr>
              <th className="pb-3">Rank</th>
              <th className="pb-3">Usuário</th>
              <th className="pb-3">Ouro</th>
              <th className="pb-3">Exército</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {realms.map((realm, index) => {
              const profile = profilesById.get(realm.user_id);
              return (
                <tr key={realm.user_id}>
                  <td className="py-3 font-bold">
                    {MEDALS[index] ?? `#${index + 1}`}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar avatarUrl={profile?.avatar} username={profile?.username} />
                      <div>
                        <p>{profile?.username ?? "Usuário não encontrado"}</p>
                        <p className="font-mono text-xs text-text-muted">{realm.user_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-amber-400">
                    {(realm.gold ?? BigInt(0)).toLocaleString("pt-BR")} 🪙
                  </td>
                  <td className="py-3">{realm.army_power ?? 0} 🗡️</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
