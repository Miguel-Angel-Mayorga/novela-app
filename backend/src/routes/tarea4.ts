import { Router } from "express"
import { saveTask4Answer } from "../services/tasks"

const router = Router()

// POST /api/tarea4/save — guarda una respuesta de reflexión en RespuestaTarea4
// Usa upsert: si ya existe una respuesta para esa pregunta en esa sesión, la actualiza
// Esto permite al estudiante corregir respuestas sin duplicar registros en BD
// Body esperado: { sesionId, pregunta (1-5), texto, score (0-1), nivel }
router.post("/save", async (req, res) => {
  try {
    const { sesionId, pregunta, texto, score, nivel } = req.body
    await saveTask4Answer({ sesionId, pregunta, texto, score, nivel })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Error guardando tarea 4" })
  }
})

export default router
