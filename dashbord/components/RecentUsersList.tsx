import { UserAvatar } from "./UserAvatar";
import { Card } from "./Card";

type User = {
  user_id: string;
  username: string | null;
  avatar: string | null;
};

type RecentUsersListProps = {
  users: User[];
};

export function RecentUsersList({ users }: RecentUsersListProps) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">👥 Últimos usuários</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-text-secondary">
            <tr>
              <th className="pb-3">Usuário</th>
              <th className="pb-3">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar avatarUrl={user.avatar} username={user.username} />
                    <span>{user.username}</span>
                  </div>
                </td>
                <td className="py-3 font-mono text-xs text-text-secondary">{user.user_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
