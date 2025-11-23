import NextAuth, {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "./auth.config";
import connectMongoDB from "./config/mongodb";
import User from "./src/app/models/User";

type DBUser = {
  _id: any;
  email: string;
  username: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectMongoDB();

          const dbUser = (await User.findOne({ email: credentials.email })
            .select("+password")
            .lean()) as DBUser | null;

          if (!dbUser) {
            console.log("User not found");
            return null;
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            dbUser.password
          );

          if (!isMatch) {
            console.log("Email or Password is not correct");
            return null;
          }


          return {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.username,
          };
        } catch (error) {
          console.log("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {

        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};


export async function auth() {
  return getServerSession(authOptions);
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;