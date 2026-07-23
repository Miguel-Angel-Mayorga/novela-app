import { Router } from "express"
import { createGameSession } from "../services/sessions"

const router = Router()

// POST /api/sesion — el frontend llama esto al dar "Comenzar"
// Crea un registro vacío en SesionJuego y devuelve su ID (UUID)
// El frontend guarda ese ID en localStorage para usarlo en todas las tareas
router.post("/", async (_req, res) => {
  try {
    const sesion = await createGameSession()
    res.json({ sesionId: sesion.id })
  } catch (err) {
    console.error("ERROR /api/sesion:", err)
    res.status(500).json({ error: "Error al crear sesion" })
  }
})

export default router
