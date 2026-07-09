import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const role = (req.auth?.user as any)?.role;

  if (!req.auth || role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/chats/:path*"],
};