import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const allowedAdmins = new Set(
  (process.env.ADMIN_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const discordProfile = profile as { id?: string } | undefined;
      return typeof discordProfile?.id === "string";
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};

export function isAdmin(session: unknown) {
  const userId = (session as { user?: { id?: string | null } } | null)?.user?.id;
  return typeof userId === "string" && allowedAdmins.has(userId);
}
