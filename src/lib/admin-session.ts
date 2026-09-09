import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "sorting_hat_admin_session";

const validIds = ["admin", "dumbledore", "hogwarts"];
const validPasswords = [
  "alohomora",
  "hogwarts",
  "magic123",
  "magic",
  "password",
  "lemon",
];

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

export function verifyAdminCredentials(id: string, password: string) {
  const cleanId = id.trim().toLowerCase();
  const cleanPassword = password.trim().toLowerCase();
  return validIds.includes(cleanId) && validPasswords.includes(cleanPassword);
}

export function createAdminSession(id: string) {
  const secret = getSessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const issuedAt = Date.now().toString();
  const payload = `${id.trim().toLowerCase()}.${issuedAt}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function isValidAdminSession(value: string | undefined) {
  const secret = getSessionSecret();
  if (!secret || !value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [id, issuedAt, signature] = parts;
  const age = Date.now() - Number(issuedAt);
  if (
    !validIds.includes(id) ||
    !Number.isFinite(age) ||
    age < 0 ||
    age > 1000 * 60 * 60 * 12
  )
    return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${id}.${issuedAt}`)
    .digest("hex");
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
