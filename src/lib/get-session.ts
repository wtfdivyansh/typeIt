"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  return session;
});
