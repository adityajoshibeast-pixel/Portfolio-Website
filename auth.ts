import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("DEBUG - raw credentials:", credentials);

        if (!credentials?.username || !credentials?.password) {
          console.log("DEBUG - missing fields");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        console.log("DEBUG - entered username:", JSON.stringify(credentials.username));
        console.log("DEBUG - env username:", JSON.stringify(adminUsername));
        console.log("DEBUG - env hash exists:", !!adminPasswordHash);
        console.log("DEBUG - env hash value:", adminPasswordHash);

        if (credentials.username !== adminUsername) {
          console.log("DEBUG - username mismatch");
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          adminPasswordHash as string
        );

        console.log("DEBUG - password valid:", isValid);

        if (!isValid) {
          return null;
        }

        return { id: "1", name: "Admin" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
});