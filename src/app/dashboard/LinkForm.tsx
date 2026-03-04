"use client";

import { useActionState } from "react";
import { addLink, deleteLink, togglePremium } from "@/app/actions/links";
import type { Link } from "@prisma/client";

export function AddLinkForm() {
  const [state, action, pending] = useActionState(addLink, {});

  return (
    <form action={action} className="space-y-3 border border-black p-4">
      <p className="text-xs font-semibold uppercase tracking-widest">Add Link</p>

      <input
        name="title"
        placeholder="Link title"
        required
        className="w-full border border-black px-3 py-2 text-sm outline-none"
      />
      <input
        name="url"
        type="url"
        placeholder="https://example.com"
        required
        className="w-full border border-black px-3 py-2 text-sm outline-none"
      />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" name="isPremium" className="w-4 h-4" />
        Mark as Premium (hidden until unlocked)
      </label>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white text-sm font-semibold py-2 px-4 hover:bg-gray-900 disabled:opacity-50 transition-colors"
      >
        {pending ? "Adding…" : "Add Link"}
      </button>
    </form>
  );
}

export function LinkRow({ link }: { link: Link }) {
  const [delState, delAction, delPending] = useActionState(deleteLink, {});
  const [toggleState, toggleAction, togglePending] = useActionState(togglePremium, {});

  return (
    <div className="flex items-center gap-3 border border-black p-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{link.title}</p>
        <p className="text-xs text-gray-500 truncate">{link.url}</p>
      </div>

      <form action={toggleAction}>
        <input type="hidden" name="linkId" value={link.id} />
        <button
          type="submit"
          disabled={togglePending}
          className={`text-xs font-semibold px-2 py-1 border transition-colors ${
            link.isPremium
              ? "bg-black text-white border-black hover:bg-gray-900"
              : "bg-white text-black border-black hover:bg-gray-100"
          }`}
        >
          {link.isPremium ? "Premium" : "Free"}
        </button>
      </form>

      <form action={delAction}>
        <input type="hidden" name="linkId" value={link.id} />
        <button
          type="submit"
          disabled={delPending}
          className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
        >
          Delete
        </button>
      </form>

      {(delState.error || toggleState.error) && (
        <p className="text-xs text-red-600">{delState.error ?? toggleState.error}</p>
      )}
    </div>
  );
}
