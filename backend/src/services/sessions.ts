import { prisma } from "../db/prisma"

// Crea una nueva sesión vacía — Prisma genera el UUID automáticamente
export async function createGameSession() {
  return prisma.sesionJuego.create({ data: {} })
}

// Devuelve todas las sesiones con sus datos relacionados (para el endpoint /api/verificar)
// "include" es el equivalente de un JOIN en SQL — trae los registros de las otras tablas
export async function getFullSessions() {
  return prisma.sesionJuego.findMany({
    include: {
      respuestasTarea1: true,
      decisiones: true,
      justificaciones: true,
      respuestasTarea4: true,
      resultado: true
    }
  })
}
