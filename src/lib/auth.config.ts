import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Lightweight auth config for middleware (no Prisma/bcrypt)
// The actual authorize logic lives in auth.ts
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is handled in the full auth.ts config
      authorize: () => null,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: sessionUpdate }) {
      if (user) {
        token.role = user.role;
        token.surgeonId = user.surgeonId;
      }
      if (trigger === "update" && sessionUpdate?.email) {
        token.email = sessionUpdate.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.surgeonId = token.surgeonId as string | null;
      }
      return session;
    },
  },
};
