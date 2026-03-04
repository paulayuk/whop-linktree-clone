"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/actions/creator";
import type { Creator } from "@prisma/client";

export function ProfileForm({ creator }: { creator: Creator | null }) {
  const [state, action, pending] = useActionState(saveProfile, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-1">
          Handle
        </label>
        <div className="flex items-center border border-black">
          <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-black">
            /u/
          </span>
          <input
            name="handle"
            defaultValue={creator?.handle ?? ""}
            placeholder="yourname"
            className="flex-1 px-3 py-2 text-sm outline-none bg-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-1">
          Display Name
        </label>
        <input
          name="title"
          defaultValue={creator?.title ?? ""}
          placeholder="Your Name"
          className="w-full border border-black px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          defaultValue={creator?.bio ?? ""}
          placeholder="A short bio..."
          rows={3}
          className="w-full border border-black px-3 py-2 text-sm outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-1">
          Premium Unlock Price (USD)
        </label>
        <div className="flex items-center border border-black">
          <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-black">
            $
          </span>
          <input
            name="unlockPrice"
            type="number"
            min="1"
            max="1000"
            step="1"
            defaultValue={creator ? (creator.unlockPrice / 100).toString() : "5"}
            className="flex-1 px-3 py-2 text-sm outline-none bg-white"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum $1. Stored in cents internally.
        </p>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-green-700 border border-green-300 bg-green-50 px-3 py-2">
          Profile saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white text-sm font-semibold py-2 px-4 hover:bg-gray-900 disabled:opacity-50 transition-colors"
      >
        {pending ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
