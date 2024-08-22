import connectMongoDB from "@/lib/backend/db/mongodb";
import { User } from "@/lib/backend/models/models";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// Remove the `export` from `authOptions`
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("User not found");
          }

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (!passwordsMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.userType,
            phoneNumber: user.phoneNumber,
            avatarImage: user.avatarImage,
          };
        } catch (error) {
          console.error("Authentication error:", error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    jwt: true, // Use JWT for session tokens
    maxAge: 2 * 24 * 60 * 60, // 2 days in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.type = user.type;
        token.phoneNumber = user.phoneNumber;
        token.avatarImage = user.avatarImage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.type = token.type;
        session.user.phoneNumber = token.phoneNumber;
        session.user.avatarImage = token.avatarImage;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
