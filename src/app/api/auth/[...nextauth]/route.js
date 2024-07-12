import connectMongoDB from "@/lib/backend/db/mongodb";
import { Utilisateur } from "@/lib/backend/models/models";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const utilisateur = await Utilisateur.findOne({ EmailUtilisateur: email });

          if (!utilisateur) {
            throw new Error("Utilisateur non trouvé");
          }

          const passwordsMatch = await bcrypt.compare(password, utilisateur.MotDePasseHash);

          if (!passwordsMatch) {
            throw new Error("Mot de passe incorrect");
          }

          console.log("Utilisateur authentifié:", utilisateur.toObject());

          return {
            id: utilisateur._id,
            email: utilisateur.EmailUtilisateur,
            firstName: utilisateur.PrenomUtilisateur,
            lastName: utilisateur.NomUtilisateur,
            type: utilisateur.TypeUtilisateur,
            numeroTelephone: utilisateur.NumeroTelephone,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error.message);
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
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.type = user.type;
        token.numeroTelephone = user.numeroTelephone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.type = token.type;
        session.user.numeroTelephone = token.numeroTelephone;
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
