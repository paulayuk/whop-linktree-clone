export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <header className="border-b border-black px-6 py-4">
        <a href="/" className="font-mono text-sm font-bold tracking-tight">
          linktree
        </a>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm text-gray-500">This page doesn&apos;t exist.</p>
        <a href="/" className="mt-4 text-sm underline hover:text-gray-600">
          Go home
        </a>
      </main>
    </div>
  );
}
