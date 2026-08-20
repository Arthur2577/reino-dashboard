import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { Card } from "./Card";
import { searchUsers } from "@/lib/admin-data";

export async function PlayerSearchBar({ query }: { query?: string }) {
  const results = query ? await searchUsers(query) : [];

  return (
    <Card className="mb-8">
      <form method="GET" action="/admin" className="flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar jogador por nome ou ID..."
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Buscar
        </button>
      </form>

      {query && (
        <div className="mt-4 divide-y divide-border/50">
          {results.length === 0 ? (
            <p className="py-4 text-sm text-text-secondary">Nenhum jogador encontrado para &quot;{query}&quot;.</p>
          ) : (
            results.map((user) => (
              <Link
                key={user.user_id}
                href={`/admin/players/${user.user_id}`}
                className="flex items-center gap-3 py-3 transition-colors hover:bg-surface-hover"
              >
                <UserAvatar avatarUrl={user.avatar} username={user.username} />
                <div>
                  <p className="text-sm">{user.username}</p>
                  <p className="font-mono text-xs text-text-muted">{user.user_id}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
