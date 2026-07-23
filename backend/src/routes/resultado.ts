import { Router } from "express"
import OpenAI from "openai"
import { saveResult } from "../services/results"

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/resultado/save — guarda el perfil final del jugador en la tabla Resultado
router.post("/save", async (req, res) => {
  try {
    const { sesionId, perfil, totalCielo, totalInfierno } = req.body
    await saveResult({ sesionId, perfil, totalCielo, totalInfierno })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Error guardando resultado" })
  }
})

// POST /api/resultado/analizar — genera análisis personalizado por personaje usando ChatGPT
// Body: { personajes: [{ id, nombre, decision, justificacion }] }
// Devuelve: [{ id, analisis }]
router.post("/analizar", async (req, res) => {
  const { personajes } = req.body
  if (!personajes?.length) return res.status(400).json({ error: "Faltan datos" })

  const prompt = personajes.map((p: { nombre: string; decision: string; justificacion: string }) =>
    `Personaje: ${p.nombre}\nDecisión: ${p.decision}\nJustificación del jugador: "${p.justificacion}"`
  ).join("\n\n")

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: `Eres un psicólogo especialista en razonamiento moral. Analiza las decisiones y justificaciones de una persona sobre 6 personajes moralmente ambiguos.
Para cada personaje genera un análisis breve (máximo 2 oraciones) que revele qué dice esa decisión y justificación sobre el perfil moral del evaluador. Sé específico con lo que escribió, no genérico.
Responde ÚNICAMENTE con un array JSON sin texto adicional: [{"id": 1, "analisis": "..."}, {"id": 2, "analisis": "..."}, ...]`
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const content = completion.choices[0].message.content || "[]"
    const resultado = JSON.parse(content)
    res.json(resultado)
  } catch (error) {
    console.error("Error análisis ChatGPT:", error)
    res.status(500).json({ error: "Error generando análisis" })
  }
})

export default router
