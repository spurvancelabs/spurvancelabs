import { SignJWT, jwtVerify } from 'jose';

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be least 32 characters long");
  }
  return new TextEncoder().encode(secret);
}

export const ACCESS_TOKEN_EXPIRATION = "15m";
export const REFRESH_TOKEN_EXPIRATION = "7d";

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function generateAccessToken(payload: { userId: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .sign(getJwtSecret());
}

export async function generateRefreshToken(payload: { userId: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
    .sign(getJwtSecret());
}
