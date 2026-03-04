import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = randomBytes(16).toString("hex");
  const nonce = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.WHOP_CLIENT_ID!,
    redirect_uri: process.env.WHOP_REDIRECT_URI!,
    scope: "openid profile email",
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const whopBase = process.env.WHOP_OAUTH_BASE ?? "https://api.whop.com";
  const authorizeUrl = `${whopBase}/oauth/authorize?${params.toString()}`;

  const res = NextResponse.redirect(authorizeUrl);

  // Store verifier + state in a short-lived cookie so the callback can use them
  const cookieOpts = "HttpOnly; Path=/; Max-Age=600; SameSite=Lax";
  res.headers.append("Set-Cookie", `pkce_verifier=${codeVerifier}; ${cookieOpts}`);
  res.headers.append("Set-Cookie", `oauth_state=${state}; ${cookieOpts}`);

  return res;
}
