export type EvaluationInput = {
  pregunta: number
  texto: string
}

export type EvaluationResult = {
  score: number
  nivel: string
}

export async function evaluateAnswer(input: EvaluationInput): Promise<EvaluationResult> {
  const response = await fetch("http://localhost:8000/evaluar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta: input.pregunta, texto: input.texto })
  })

  if (!response.ok) {
    throw new Error("Evaluation service failed")
  }

  return response.json()
}
