import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { getAuthSecret } from "@/lib/env";

const SECRET = getAuthSecret();
const COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 kun

export type SessionPayload = {
  adminId: number;
  email: string;
  name: string;
  /** epoch ms — `iat`dan aniqroq, revoke solishtiruvi uchun ishlatiladi. */
  iatMs: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: Omit<SessionPayload, "iatMs">) {
  const token = await new SignJWT({ ...payload, iatMs: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Barcha chiqarilgan sessiyalarni bekor qiladi. JWT stateless bo'lgani uchun
 * cookie'ni o'chirish token'ni o'ldirmaydi — shuning uchun admin yozuvida
 * "shu vaqtdan oldingi tokenlar yaroqsiz" belgisi saqlanadi.
 */
export async function revokeSessions(adminId: number) {
  await db
    .update(admins)
    .set({ sessionsRevokedAt: Date.now() })
    .where(eq(admins.id, adminId))
    .run();
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const session = payload as unknown as SessionPayload;
    if (!session || typeof session.adminId !== "number") return null;

    // Token o'zi yaroqli, lekin admin o'chirilgan yoki sessiyalari bekor
    // qilingan bo'lishi mumkin — buni faqat DB biladi.
    const admin = await db
      .select({ id: admins.id, sessionsRevokedAt: admins.sessionsRevokedAt })
      .from(admins)
      .where(and(eq(admins.id, session.adminId)))
      .get();
    if (!admin) return null;
    const revoked = admin.sessionsRevokedAt;
    if (typeof revoked === "number") {
      const issued =
        typeof payload.iatMs === "number"
          ? payload.iatMs
          : typeof payload.iat === "number"
            ? payload.iat * 1000
            : 0;
      if (issued <= revoked) return null;
    }

    return session;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
