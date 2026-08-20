"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    throw new Error("Acesso negado: apenas administradores podem fazer isso.");
  }
}

export async function updateRealm(userId: string, formData: FormData) {
  await assertAdmin();

  const gold = formData.get("gold");
  const safeVault = formData.get("safe_vault");
  const armyPower = formData.get("army_power");
  const wallLevel = formData.get("wall_level");
  const vaultLevel = formData.get("vault_level");

  await prisma.realms.update({
    where: { user_id: userId },
    data: {
      gold: gold ? BigInt(gold.toString()) : undefined,
      safe_vault: safeVault ? BigInt(safeVault.toString()) : undefined,
      army_power: armyPower ? Number(armyPower) : undefined,
      wall_level: wallLevel ? Number(wallLevel) : undefined,
      vault_level: vaultLevel ? Number(vaultLevel) : undefined,
    },
  });

  revalidatePath(`/admin/players/${userId}`);
}

export async function resetCooldowns(userId: string) {
  await assertAdmin();

  await prisma.realms.update({
    where: { user_id: userId },
    data: {
      work_cooldown_until: 0,
      attack_cooldown_until: 0,
      shield_until: 0,
      protection_until: 0,
    },
  });

  revalidatePath(`/admin/players/${userId}`);
}
