import "dotenv/config"  // Carga variables de backend/.env (DATABASE_URL, PORT)
import express from "express"
import cors from "cors"
import sesionRouter from "./routes/sesion"
import evaluarRouter from "./routes/evaluar"
import verificarRouter from "./routes/verificar"
import tarea1Router from "./routes/tarea1"
import tarea2Router from "./routes/tarea2"
import tarea3Router from "./routes/tarea3"
import tarea4Router from "./routes/tarea4"
import resultadoRouter from "./routes/resultado"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())          // Permite peticiones desde el frontend (localhost:5173)
app.use(express.json())  // Parsea el body de las peticiones como JSON

// Cada ruta maneja una parte del juego
app.use("/api/sesion", sesionRouter)      // Crea una nueva sesión de juego
app.use("/api/evaluar", evaluarRouter)    // Evalúa respuestas de texto (heurística)
app.use("/api/verificar", verificarRouter) // Devuelve todas las sesiones (debug/admin)
app.use("/api/tarea1", tarea1Router)      // Guarda respuestas de análisis
app.use("/api/tarea2", tarea2Router)      // Guarda decisiones Cielo/Infierno
app.use("/api/tarea3", tarea3Router)      // Guarda justificaciones
app.use("/api/tarea4", tarea4Router)      // Guarda respuestas de reflexión
app.use("/api/resultado", resultadoRouter) // Guarda el perfil final del jugador

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})
