import { Button } from "./Button";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
};

export function PageHeader({ eyebrow, title }: PageHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-border pb-6">
      <div>
        <p className="text-sm text-accent-text">{eyebrow}</p>
        <h1 className="text-3xl font-extrabold">{title}</h1>
      </div>
      <Button href="/api/auth/signout" variant="secondary" className="!px-4 !py-2 !text-sm !font-normal">
        Sair
      </Button>
    </header>
  );
}
