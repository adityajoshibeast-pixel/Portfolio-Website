export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5 font-mono text-2xl text-accent">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
            {"{"}
          </span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
            •
          </span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
            •
          </span>
          <span className="animate-bounce" style={{ animationDelay: "450ms" }}>
            •
          </span>
          <span className="animate-bounce" style={{ animationDelay: "600ms" }}>
            {"}"}
          </span>
        </div>
        <p className="font-mono text-sm text-muted">loading dashboard...</p>
      </div>
    </div>
  );
}