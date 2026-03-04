import Whop from "@whop/sdk";

// Platform-level client — uses the platform API key for all operations
// (creating connected companies, generating account links, etc.)
const globalForWhop = globalThis as unknown as { whop: Whop };

export const whop =
  globalForWhop.whop ??
  new Whop({
    apiKey: process.env.WHOP_API_KEY!,
  });

if (process.env.NODE_ENV !== "production") globalForWhop.whop = whop;

// Create a short-lived user-scoped client using a user's OAuth token
export function whopAsUser(oauthToken: string): Whop {
  return new Whop({ apiKey: `Bearer ${oauthToken}` });
}
