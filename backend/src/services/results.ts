import { prisma } from "../db/prisma"

export type SaveResultInput = {
  sesionId: string
  perfil: string        // Ej: "El Misericordioso", "El Implacable", etc.
  totalCielo: number
  totalInfierno: number
}

// Guarda el resultado final — la lógica del perfil se calcula en Resultado.tsx (frontend)
// sesionId es UNIQUE en la tabla, por lo que cada sesión solo puede tener un resultado
export async function saveResult(input: SaveResultInput) {
  return prisma.resultado.create({ data: input })
}
