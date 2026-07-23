import { Router } from "express"
import OpenAI from "openai"

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/evaluar — envía el texto a GPT-4o-mini y devuelve { score, nivel }
// GPT evalúa argumentación, pensamiento crítico y análisis específico del escenario
router.post("/", async (req, res) => {
  const { texto } = req.body
  console.log("EVALUAR recibido:", texto?.substring(0, 50))
  if (!texto) return res.status(400).json({ error: "Falta el texto" })

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content: `Eres un evaluador de respuestas psicotécnicas de razonamiento moral para personas de 18 a 40 años.
Evalúa la respuesta considerando:
1. Argumentación: ¿justificó su posición con razones claras?
2. Pensamiento crítico: ¿consideró múltiples ángulos o matices?
3. Análisis específico: ¿conectó con el escenario planteado?
4. Desarrollo: ¿hay profundidad o es superficial?

Responde ÚNICAMENTE con este JSON exacto, sin texto adicional:
{"score": 0.75, "nivel": "Alto"}

Criterios de nivel:
- "Alto": score >= 0.65 — respuesta analítica, bien argumentada
- "Medio": score >= 0.35 — respuesta con algún argumento o desarrollo
- "Bajo": score < 0.35 — respuesta vaga, muy corta o sin argumentos`
        },
        {
          role: "user",
          content: `Evalúa esta respuesta de razonamiento moral:\n\n"${texto}"`
        }
      ]
    })

    const content = completion.choices[0].message.content || '{"score": 0, "nivel": "Bajo"}'
    const resultado = JSON.parse(content)
    console.log("EVALUAR resultado:", resultado)
    res.json(resultado)

  } catch (error) {
    console.error("Error OpenAI:", error)
    res.json({ score: 0, nivel: "Error" })
  }
})

export default router
