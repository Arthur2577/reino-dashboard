import Image from "next/image";

type UserAvatarProps = {
  avatarUrl?: string | null;
  username?: string | null;
};

export function UserAvatar({ avatarUrl, username }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`Avatar de ${username ?? "usuário"}`}
        width={32}
        height={32}
        className="rounded-full"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
      ?
    </div>
  );
}
