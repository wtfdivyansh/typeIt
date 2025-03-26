import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { account, session, user, verification } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", 
    schema: {
      user,
      account,
      session,
      verification
    }
  }),
  emailAndPassword:{
    enabled:true,
    autoSignIn:true
  },
  socialProviders:{
    google:{
      clientId:process.env.GOOGLE_CLIENT_ID!,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET!
    },
    github:{
      clientId:process.env.GITHUB_CLIENT_ID!, 
      clientSecret:process.env.GITHUB_CLIENT_SECRET!
    }
  }
});
