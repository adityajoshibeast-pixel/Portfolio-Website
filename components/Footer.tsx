export default function Footer() {
  return (
    <div className="border-t border-surface-2 px-6 py-6 text-center">
      <p className="font-body text-xs text-muted">
        © {new Date().getFullYear()} Aditya Joshi. All rights reserved.
      </p>
    </div>
  );
}