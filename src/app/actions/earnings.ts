"use server";

import { prisma } from "@/lib/prisma";
import { whop } from "@/lib/whop";
import { getCurrentUserId } from "@/lib/session";
import { redirect } from "next/navigation";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function enableEarnings(): Promise<{ error: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Not authenticated" };

  const creator = await prisma.creator.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!creator) return { error: "Create a profile first" };

  // Already enrolled — re-generate onboarding link in case they need to finish KYC
  let companyId = creator.whopCompanyId;

  if (!companyId) {
    if (!creator.user.email) {
      return { error: "Your Whop account has no email address. Please add one at whop.com/settings before enabling earnings." };
    }

    // Create a connected account company under the platform
    const company = await whop.companies.create({
      title: creator.title || creator.handle,
      parent_company_id: process.env.WHOP_PARENT_COMPANY_ID!,
      email: creator.user.email,
    });

    companyId = company.id;

    await prisma.creator.update({
      where: { id: creator.id },
      data: { whopCompanyId: companyId },
    });
  }

  // Generate KYC / account onboarding link
  const accountLink = await whop.accountLinks.create({
    company_id: companyId,
    use_case: "account_onboarding",
    return_url: `${APP_URL}/api/earnings/complete`,
    refresh_url: `${APP_URL}/dashboard?refresh=true`,
  });

  redirect(accountLink.url);
}
