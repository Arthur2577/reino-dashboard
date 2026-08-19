import { prisma } from "@/lib/prisma";

export async function getUserRealm(userId: string) {
  return prisma.realms.findUnique({ where: { user_id: userId } });
}