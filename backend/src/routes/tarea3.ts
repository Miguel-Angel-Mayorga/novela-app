import { Router } from "express"
import { saveTask3Justifications } from "../services/tasks"

const router = Router()

// POST /api/tarea3/save — guarda todas las justificaciones de una vez al terminar el último personaje
// Body esperado: { sesionId, justificaciones: [{ personajeId, personajeNombre, texto }] }
// Nota: esta tarea no evalúa con score, solo guarda el texto libre
router.post("/save", async (req, res) => {
  try {
    const { sesionId, justificaciones } = req.body
    await saveTask3Justifications(sesionId, justificaciones)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Error guardando tarea 3" })
  }
})

export default router
