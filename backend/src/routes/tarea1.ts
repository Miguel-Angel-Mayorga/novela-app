import { Router } from "express"
import { saveTask1Answer } from "../services/tasks"

const router = Router()

// POST /api/tarea1/save — guarda una respuesta de análisis en RespuestaTarea1
// El frontend llama esto después de evaluar cada pregunta (6 veces en total)
// Body esperado: { sesionId, pregunta (1-6), texto, score (0-1), nivel ("Alto"/"Medio"/"Bajo") }
router.post("/save", async (req, res) => {
  try {
    const { sesionId, pregunta, texto, score, nivel } = req.body
    await saveTask1Answer({ sesionId, pregunta, texto, score, nivel })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Error guardando tarea 1" })
  }
})

export default router
