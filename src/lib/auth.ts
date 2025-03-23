import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", 
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
