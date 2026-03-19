"use client";

import { useActionState } from "react";
import { enableEarnings } from "@/app/actions/earnings";

export function EarningsButton({
  enrolled,
  payoutEnabled,
}: {
  enrolled: boolean;
  payoutEnabled: boolean;
}) {
  const [state, action, pending] = useActionState(enableEarnings, {
    error: "",
  });

  return (
    <div className="border border-dashed border-black p-6">
      {payoutEnabled ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            ✓ Earnings enabled. Your connected account is set up.
          </p>
          <form action={action}>
            <button
              type="submit"
              disabled={pending}
              className="text-sm underline text-gray-600 hover:text-black disabled:opacity-50"
            >
              {pending ? "Opening…" : "Manage account onboarding →"}
            </button>
          </form>
        </div>
      ) : enrolled ? (
        <div className="space-y-3">
          <p className="text-sm text-yellow-700 font-medium">
            ⚠ Account created but KYC not complete. Finish onboarding to accept payments.
          </p>
          <form action={action}>
            <button
              type="submit"
              disabled={pending}
              className="bg-black text-white text-sm font-semibold py-2 px-6 hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {pending ? "Opening…" : "Complete Onboarding →"}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Enable earnings to accept payments for premium links.
          </p>
          <form action={action}>
            <button
              type="submit"
              disabled={pending}
              className="bg-black text-white text-sm font-semibold py-2 px-6 hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {pending ? "Setting up…" : "Enable Earnings"}
            </button>
          </form>
        </div>
      )}

      {state?.error && (
        <p className="text-sm text-red-600 mt-3">{state.error}</p>
      )}
    </div>
  );
}
