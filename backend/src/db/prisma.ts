import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const { Pool } = pg

// Conexión a PostgreSQL usando la URL del archivo .env (backend/.env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

// Adaptador que conecta Prisma con el driver nativo de PostgreSQL (pg)
const adapter = new PrismaPg(pool)

// Evita crear múltiples instancias de Prisma en desarrollo (hot-reload crearía nuevas cada vez)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
