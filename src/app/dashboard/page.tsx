import { getCurrentUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";
import { AddLinkForm, LinkRow } from "./LinkForm";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  // layout.tsx already redirects if userId is null, so we can assert here
  const creator = await prisma.creator.findUnique({
    where: { userId: userId! },
    include: { links: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="border-b border-black px-6 py-4 flex items-center justify-between">
        <span className="font-mono text-sm font-bold tracking-tight">
          linktree / dashboard
        </span>
        {creator && (
          <a
            href={`/u/${creator.handle}`}
            target="_blank"
            className="text-xs underline text-gray-600 hover:text-black"
          >
            View public page →
          </a>
        )}
      </header>

      <main className="max-w-xl mx-auto px-6 py-10 space-y-10">
        {/* Profile section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Profile
          </h2>
          <ProfileForm creator={creator} />
        </section>

        {/* Links section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Links
          </h2>

          {!creator && (
            <p className="text-sm text-gray-500 mb-4">
              Save your profile first to start adding links.
            </p>
          )}

          {creator && creator.links.length === 0 && (
            <p className="text-sm text-gray-500 mb-4">No links yet.</p>
          )}

          {creator && creator.links.length > 0 && (
            <div className="space-y-2 mb-4">
              {creator.links.map((link) => (
                <LinkRow key={link.id} link={link} />
              ))}
            </div>
          )}

          {creator && <AddLinkForm />}
        </section>

        {/* Earnings section — placeholder for Step 4 */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Earnings
          </h2>
          <div className="border border-dashed border-black p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Enable earnings to accept payments for premium links.
            </p>
            <button
              disabled
              className="bg-black text-white text-sm font-semibold py-2 px-6 opacity-40 cursor-not-allowed"
            >
              Enable Earnings (Step 4)
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
