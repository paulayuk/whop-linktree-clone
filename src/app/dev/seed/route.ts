// DEV ONLY — creates a test user and sets a session cookie so you can test
// the dashboard without real OAuth. This route is removed in Step 4.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  let user = await prisma.user.findUnique({ where: { whopUserId: "dev-user-1" } });
  if (!user) {
    user = await prisma.user.create({
      data: { whopUserId: "dev-user-1", email: "dev@example.com" },
    });
  }

  const session = await getSession();
  session.userId = user.id;
  session.whopUserId = "dev-user-1";
  await session.save();

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
