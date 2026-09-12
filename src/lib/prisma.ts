import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 5,                          // stay well under the Supabase pooler's 15-session limit
  min: 0,                          // don't hold idle connections open
  idleTimeoutMillis: 30_000,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;