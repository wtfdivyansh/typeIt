import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";
export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {

  return c.json({
    message: "Hello from Hono on Vercel! by typeit 👋",
  });
});


app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export  const PUT = handle(app);
