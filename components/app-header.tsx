import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/saved", label: "Saved" },
  { href: "/profile", label: "Profile" },
];

export function AppHeader() {
  return (
    <header className="border-b border-neutral-200/70">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] text-neutral-500"
        >
          Quiet Curation
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-neutral-500 hover:text-neutral-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
