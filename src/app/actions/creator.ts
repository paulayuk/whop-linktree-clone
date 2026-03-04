"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  handle: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, - and _"),
  title: z.string().max(80),
  bio: z.string().max(300),
  unlockPrice: z.coerce.number().int().min(100).max(100000), // cents, $1–$1000
});

export type ActionResult = { error?: string; success?: boolean };

export async function saveProfile(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Not authenticated" };

  const raw = {
    handle: formData.get("handle"),
    title: formData.get("title"),
    bio: formData.get("bio"),
    unlockPrice: formData.get("unlockPrice"),
  };

  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { handle, title, bio, unlockPrice } = parsed.data;

  // Check handle uniqueness (excluding current creator)
  const existing = await prisma.creator.findUnique({ where: { handle } });
  const myCreator = await prisma.creator.findUnique({ where: { userId } });

  if (existing && existing.userId !== userId) {
    return { error: "Handle is already taken" };
  }

  if (myCreator) {
    await prisma.creator.update({
      where: { userId },
      data: { handle, title, bio, unlockPrice },
    });
  } else {
    await prisma.creator.create({
      data: { userId, handle, title, bio, unlockPrice },
    });
  }

  revalidatePath("/dashboard");
  return { success: true };
}
