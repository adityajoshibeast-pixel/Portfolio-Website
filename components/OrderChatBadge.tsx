"use client";

export default function OrderChatBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg bg-red-500">
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </span>
  );
}