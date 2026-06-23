import crypto from "crypto";
import { cookies } from "next/headers";

const ALGORITHM = "aes-256-cbc";
const SESSION_COOKIE_NAME = "tuk_session";

// Validate AUTH_SECRET is set - no fallback for security
const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required for session encryption");
}

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(AUTH_SECRET)
  .digest();

interface SessionData {
  userId: string;
  email: string;
  role: string;
  name: string;
  loginTimestamp?: number;
}

export function encryptSession(data: SessionData): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptSession(encryptedSession: string): SessionData | null {
  try {
    const [ivHex, encryptedHex] = encryptedSession.split(":");
    if (!ivHex || !encryptedHex) return null;

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString("utf8"));
  } catch {
    return null;
  }
}

export function createSessionCookie(sessionToken: string, maxAge = 60 * 60 * 24 * 7): string {
  return `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSessionFromCookies(cookies: string): SessionData | null {
  const sessionMatch = cookies.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  if (!sessionMatch) return null;

  const sessionToken = sessionMatch[1];
  const session = decryptSession(sessionToken);

  if (!session) return null;

  // Check expiration (7 days) - if no loginTimestamp, session is invalid
  if (!session.loginTimestamp) {
    return null;
  }
  const expirationTime = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - session.loginTimestamp > expirationTime) {
    return null;
  }

  return session;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashed: string): boolean {
  const [salt, hash] = hashed.split(":");
  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, "hex");
  const derivedHash = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(hashBuffer, derivedHash);
}

// Require admin authentication for sensitive operations
export async function requireAdmin(session: SessionData | null): Promise<{ success: true } | { success: false; error: string }> {
  if (!session) {
    return { success: false, error: "Unauthorized: No valid session" };
  }
  if (session.role !== "ADMIN") {
    return { success: false, error: "Forbidden: Admin access required" };
  }
  return { success: true };
}

// --- Server Action helpers (use with "use server" in callers) ---

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decryptSession(token);
}

export async function createSession(userId: string, role: string): Promise<void> {
  const sessionData: SessionData = {
    userId,
    email: "",
    role,
    name: "",
    loginTimestamp: Date.now(),
  };
  const encryptedToken = encryptSession(sessionData);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encryptedToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
