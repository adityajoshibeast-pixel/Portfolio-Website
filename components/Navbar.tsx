import Link from "next/link";

export default function Navbar({ showLinks = true }: { showLinks?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-2/60 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-lg font-medium text-text">
          Aditya<span className="text-accent">.dev</span>
          <span className="ml-0.5 text-accent animate-blink">_</span>
        </Link>

        {showLinks && (
          <div className="flex items-center gap-6 font-body text-sm text-muted sm:gap-8">
            <a href="/#projects" className="hidden transition-colors hover:text-text sm:inline">
              Projects
            </a>
            <a href="/#about" className="hidden transition-colors hover:text-text sm:inline">
              About
            </a>
            <a href="/#contact" className="hidden transition-colors hover:text-text sm:inline">
              Contact
            </a>
            <a href="/blog" className="transition-colors hover:text-text">
              Blog
            </a>
          </div>
        )}

        <a href="/#contact" className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90">
          Hire Me
        </a>
      </nav>
    </header>
  );
}