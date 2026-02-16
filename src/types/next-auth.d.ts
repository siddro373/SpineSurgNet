import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      surgeonId: string | null;
    };
  }

  interface User {
    role: string;
    surgeonId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    surgeonId: string | null;
  }
}
