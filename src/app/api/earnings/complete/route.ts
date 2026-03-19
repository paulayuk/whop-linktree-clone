import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.redirect(`${APP_URL}/`);

  const creator = await prisma.creator.findUnique({ where: { userId } });

  if (creator?.whopCompanyId) {
    await prisma.creator.update({
      where: { userId },
      data: { payoutEnabled: true },
    });
  }

  return NextResponse.redirect(`${APP_URL}/dashboard?enrolled=true`);
}
