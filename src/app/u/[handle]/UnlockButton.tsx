"use client";

import { useActionState } from "react";
import { createCheckout } from "@/app/actions/checkout";

export function UnlockButton({
  creatorId,
  priceInCents,
}: {
  creatorId: string;
  priceInCents: number;
}) {
  const action = createCheckout.bind(null, creatorId);
  const [state, formAction, pending] = useActionState(action, { error: "" });

  const dollars = (priceInCents / 100).toFixed(2);

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="w-full border border-black bg-black text-white text-sm font-semibold py-3 px-4 hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {pending ? "Redirecting to checkout…" : `Unlock Premium Links — $${dollars}`}
        </button>
      </form>
      {state?.error && (
        <p className="text-sm text-red-600 mt-2 text-center">{state.error}</p>
      )}
    </div>
  );
}
