"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function DiscordSignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        signIn("discord", { callbackUrl: "/" });
      }}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Conectando...
        </>
      ) : (
        "Entrar com Discord"
      )}
    </button>
  );
}
