import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

// Get values from environment variables
const KEY_ID = Deno.env.get("APNS_KEY_ID");
const TEAM_ID = Deno.env.get("APNS_TEAM_ID");
const BUNDLE_ID = Deno.env.get("APNS_BUNDLE_ID");

export async function getAuthTokenFromAPN(): Promise<string> {
  try {
    // Get the key from environment variable
    const privateKeyBase64 = Deno.env.get("APNS_AUTH_KEY_BASE64");
    if (!privateKeyBase64) {
      throw new Error("APNS_AUTH_KEY_BASE64 environment variable not set");
    }

    // Decode the base64 key
    const keyData = base64Decode(privateKeyBase64);

    // Import the key
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      keyData,
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign"]
    );

    // Create JWT header
    const header = {
      alg: "ES256",
      kid: KEY_ID,
    };

    // Create JWT payload with expiration
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: TEAM_ID,
      iat: now,
      exp: now + 3600, // Token valid for 1 hour
    };

    // Create and sign the JWT
    const token = await create(header, payload, privateKey);

    console.log("Successfully generated APNs auth token");
    return token;
  } catch (error) {
    console.error("Error generating APNs auth token:", error);
    throw error;
  }
}

// Helper function to decode base64
function base64Decode(str: string): Uint8Array {
  const binString = atob(str);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

export { KEY_ID, TEAM_ID, BUNDLE_ID };
