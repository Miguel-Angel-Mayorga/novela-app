import { Router } from "express"
import { getFullSessions } from "../services/sessions"

const router = Router()

// GET /api/verificar — endpoint de diagnóstico/admin
// Devuelve todas las sesiones con todos sus datos relacionados (respuestas, decisiones, resultado)
// Útil para revisar desde Postman o el navegador si los datos se están guardando bien
router.get("/", async (_req, res) => {
  try {
    const sesiones = await getFullSessions()
    res.json({ sesiones })
  } catch {
    res.status(500).json({ error: "Error al obtener sesiones" })
  }
})

export default router
