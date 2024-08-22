// src/types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      type: string;
      phoneNumber: string;
      avatarImage: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    type: string;
    phoneNumber: string;
    avatarImage: string;
  }
}
