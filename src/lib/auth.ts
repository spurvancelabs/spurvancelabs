import jwt from "jsonwebtoken";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be least 32 characters long");
  }
  return secret;
}

export const ACCESS_TOKEN_EXPIRATION = "15m";
export const REFRESH_TOKEN_EXPIRATION = "7d";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}


export function generateAccessToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

export function generateRefreshToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: REFRESH_TOKEN_EXPIRATION });
}
