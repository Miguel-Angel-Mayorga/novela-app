import { prisma } from "../db/prisma"

// Tipos que definen la forma del dato que llega del frontend
export type SaveTextAnswerInput = {
  sesionId: string
  pregunta: number
  texto: string
  score: number
  nivel: string
}

export type TaskDecisionInput = {
  personajeId: number
  personajeNombre: string
  decision: string  // "Cielo" | "Infierno"
}

export type TaskJustificationInput = {
  personajeId: number
  personajeNombre: string
  texto: string
}

// Inserta una respuesta de Tarea1 (una por pregunta, 6 en total por sesión)
export async function saveTask1Answer(input: SaveTextAnswerInput) {
  return prisma.respuestaTarea1.create({ data: input })
}

// Inserta todas las decisiones Cielo/Infierno de golpe (createMany = INSERT múltiple)
export async function saveTask2Decisions(sesionId: string, decisiones: TaskDecisionInput[]) {
  return prisma.decisionTarea2.createMany({
    data: decisiones.map(d => ({
      sesionId,
      personajeId: d.personajeId,
      personajeNombre: d.personajeNombre,
      decision: d.decision
    }))
  })
}

// Inserta todas las justificaciones de golpe al terminar el último personaje
export async function saveTask3Justifications(sesionId: string, justificaciones: TaskJustificationInput[]) {
  return prisma.justificacionTarea3.createMany({
    data: justificaciones.map(j => ({
      sesionId,
      personajeId: j.personajeId,
      personajeNombre: j.personajeNombre,
      texto: j.texto
    }))
  })
}

// Upsert: si ya existe una respuesta para esa sesión+pregunta la actualiza, si no la crea
// Esto evita duplicados si el estudiante recarga la página en medio de Tarea4
export async function saveTask4Answer(input: SaveTextAnswerInput) {
  return prisma.respuestaTarea4.upsert({
    where: { sesionId_pregunta: { sesionId: input.sesionId, pregunta: input.pregunta } },
    update: { texto: input.texto, score: input.score, nivel: input.nivel },
    create: input
  })
}
