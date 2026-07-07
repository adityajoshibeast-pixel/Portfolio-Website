export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-2/60 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="font-mono text-lg font-medium text-text">
          aditya<span className="text-accent">.dev</span>
          <span className="ml-0.5 text-accent animate-blink">_</span>
        </div>

        <div className="hidden gap-8 font-body text-sm text-muted sm:flex">
          <a href="#projects" className="transition-colors hover:text-text">Projects</a>
          <a href="#about" className="transition-colors hover:text-text">About</a>
          <a href="#contact" className="transition-colors hover:text-text">Contact</a>
          <a href="/blog" className="transition-colors hover:text-text">
  Blog
</a>
        </div>

        <a href="#contact" className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90">
          Hire Me
        </a>
      </nav>
    </header>
  );
}