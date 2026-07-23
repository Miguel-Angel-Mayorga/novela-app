import { Router } from "express"
import { saveTask2Decisions } from "../services/tasks"

const router = Router()

// POST /api/tarea2/save — guarda todos los veredictos Cielo/Infierno de una vez
// Body esperado: { sesionId, decisiones: [{ personajeId, personajeNombre, decision }] }
// Se llama una sola vez al presionar "Continuar a Justificación"
router.post("/save", async (req, res) => {
  try {
    const { sesionId, decisiones } = req.body
    await saveTask2Decisions(sesionId, decisiones)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Error guardando tarea 2" })
  }
})

export default router
