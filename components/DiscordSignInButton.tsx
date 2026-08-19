"use client";

import { signIn } from "next-auth/react";

export function DiscordSignInButton() {
  return (
    <button
      onClick={() => signIn("discord", { callbackUrl: "/" })}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover active:scale-[0.98]"
    >
      Entrar com Discord
    </button>
  );
}