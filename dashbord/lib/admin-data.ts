import { prisma } from "@/lib/prisma";

export async function getAdminDashboardData() {
  const [totalUsers, totalGuilds, realms, users] = await Promise.all([
    prisma.users.count(),
    prisma.guild_settings.count(),
    prisma.realms.findMany({
      take: 10,
      orderBy: { gold: "desc" },
      select: { user_id: true, gold: true, army_power: true },
    }),
    prisma.users.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      select: { user_id: true, username: true, avatar: true },
    }),
  ]);

  const profiles = await prisma.users.findMany({
    where: { user_id: { in: realms.map((realm) => realm.user_id) } },
    select: { user_id: true, username: true, avatar: true },
  });
  const profilesById = new Map(profiles.map((profile) => [profile.user_id, profile]));

  return { totalUsers, totalGuilds, realms, users, profilesById };
}

export async function searchUsers(query: string) {
  if (!query.trim()) return [];

  return prisma.users.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { user_id: { contains: query } },
      ],
    },
    take: 20,
    select: { user_id: true, username: true, avatar: true },
  });
}

export async function getPlayerDetail(userId: string) {
  const [user, realm] = await Promise.all([
    prisma.users.findUnique({ where: { user_id: userId } }),
    prisma.realms.findUnique({ where: { user_id: userId } }),
  ]);

  return { user, realm };
}

export async function getGuildSettings() {
  return prisma.guild_settings.findMany();
}
