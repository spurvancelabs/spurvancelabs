import jwt from "jsonwebtoken";

export function getJwtSecret() {
  return process.env.JWT_SECRET || "your-secret-key";
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
}
