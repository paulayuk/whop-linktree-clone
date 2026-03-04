import { getCurrentUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await getCurrentUserId();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <header className="border-b border-black px-6 py-4">
        <span className="font-mono text-sm font-bold tracking-tight">linktree</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          One link.<br />Everything you make.
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-sm">
          Share your links and charge for premium content — powered by Whop.
        </p>

        <a
          href="/dev/seed"
          className="bg-black text-white text-sm font-semibold py-3 px-8 hover:bg-gray-900 transition-colors"
        >
          Create your link page
        </a>

        <p className="text-xs text-gray-400 mt-4">
          DEV MODE: clicking above sets a dev session.
          <br />
          This button will trigger real Whop OAuth in Step 4.
        </p>
      </main>
    </div>
  );
}
