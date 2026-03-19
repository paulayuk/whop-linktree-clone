import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { whop } from "@/lib/whop";
import { UnlockButton } from "./UnlockButton";

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{
    unlocked?: string;
    payment_id?: string;
    checkout_status?: string;
  }>;
}

export default async function PublicProfilePage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { unlocked, payment_id, checkout_status } = await searchParams;

  const creator = await prisma.creator.findUnique({
    where: { handle },
    include: { links: { orderBy: { sortOrder: "asc" } } },
  });

  if (!creator) notFound();

  // On success redirect: verify payment server-side and mark unlock as PAID
  if (
    checkout_status === "success" &&
    payment_id &&
    unlocked
  ) {
    try {
      const payment = await whop.payments.retrieve(payment_id);

      if (payment.status === "paid") {
        await prisma.unlock.updateMany({
          where: {
            id: unlocked,
            creatorId: creator.id,
            status: "PENDING", // idempotent — only update if still pending
          },
          data: {
            status: "PAID",
            whopPaymentId: payment_id,
          },
        });
      }
    } catch (err) {
      // Non-fatal — webhook will catch it if this fails
      console.error("[u/handle] payment verify failed:", err);
    }
  }

  // Check if this visitor has a paid unlock
  let hasPaidUnlock = false;
  if (unlocked) {
    const unlock = await prisma.unlock.findUnique({ where: { id: unlocked } });
    hasPaidUnlock = unlock?.creatorId === creator.id && unlock?.status === "PAID";
  }

  const freeLinks = creator.links.filter((l) => !l.isPremium);
  const premiumLinks = creator.links.filter((l) => l.isPremium);
  const hasEarnings = !!creator.whopCompanyId;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="border-b border-black px-6 py-4">
        <a href="/" className="font-mono text-sm font-bold tracking-tight">
          linkstacks
        </a>
      </header>

      <main className="max-w-lg mx-auto px-6 py-12">
        {/* Creator header */}
        <div className="mb-10 text-center">
          {creator.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creator.avatarUrl}
              alt={creator.title}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border border-black"
            />
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-black flex items-center justify-center text-white text-xl font-bold">
              {(creator.title || creator.handle).charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-xl font-bold">{creator.title || creator.handle}</h1>
          {creator.bio && (
            <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">
              {creator.bio}
            </p>
          )}
        </div>

        {/* Free links */}
        <div className="space-y-3">
          {freeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border border-black px-4 py-3 text-sm font-medium text-center hover:bg-black hover:text-white transition-colors"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Premium links section */}
        {premiumLinks.length > 0 && (
          <div className="mt-6">
            <div className="border-t border-dashed border-black pt-6 space-y-3">
              {hasPaidUnlock ? (
                <>
                  <p className="text-xs text-center text-gray-500 uppercase tracking-widest mb-4">
                    Premium links
                  </p>
                  {premiumLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full border border-black px-4 py-3 text-sm font-medium text-center hover:bg-black hover:text-white transition-colors"
                    >
                      {link.title}
                    </a>
                  ))}
                </>
              ) : (
                <>
                  {premiumLinks.map((link) => (
                    <div
                      key={link.id}
                      className="w-full border border-black px-4 py-3 text-sm font-medium text-center text-gray-300 bg-gray-50 select-none"
                    >
                      🔒 {link.title}
                    </div>
                  ))}

                  {hasEarnings ? (
                    <div className="mt-4">
                      <UnlockButton
                        creatorId={creator.id}
                        priceInCents={creator.unlockPrice}
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-center text-gray-400 mt-4">
                      Premium links coming soon.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
