import { cookies } from "next/headers";
import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SESSION_COOKIE_NAME = "tuk_session";
// Fallback static key if AUTH_SECRET is not available
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.AUTH_SECRET || "fallback-secret-key-tuk-123456")
  .digest();

// AES Encryption helper
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// AES Decryption helper
function decrypt(text: string): string {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift() || "", "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

interface SessionData {
  userId: string;
  role: string;
  expires: string;
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionData: SessionData = {
    userId,
    role,
    expires: expiresAt.toISOString(),
  };

  const encryptedSession = encrypt(JSON.stringify(sessionData));
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie) return null;

  try {
    const decrypted = decrypt(cookie.value);
    const session: SessionData = JSON.parse(decrypted);

    // Verify expiration
    if (new Date(session.expires) < new Date()) {
      await deleteSession();
      return null;
    }

    return session;
  } catch (err) {
    console.error("Failed to decrypt or parse session cookie:", err);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
