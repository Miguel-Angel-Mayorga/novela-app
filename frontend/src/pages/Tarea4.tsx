import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"

const preguntas = [
  { id: 1, texto: "¿Cómo describirías el proceso de razonamiento que seguiste para tomar tus decisiones?" },
  { id: 2, texto: "¿En qué momentos sentiste mayor incertidumbre o dificultad para juzgar? ¿Por qué?" },
  { id: 3, texto: "¿Qué criterios terminaron siendo los más importantes para ti al momento de juzgar? ¿Cambiaron durante el proceso?" },
  { id: 4, texto: "Si pudieras revisar alguna de tus decisiones, ¿cuál sería y qué cambiarías?" },
  { id: 5, texto: "¿Qué aprendiste sobre tu propia forma de pensar y juzgar a través de esta experiencia?" }
]

export default function Tarea4() {
  const navigate = useNavigate()
  const [actual, setActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<number, string>>({})
  const [evaluando, setEvaluando] = useState(false)
  const [resultado, setResultado] = useState<{ score: number; nivel: string } | null>(null)

  const pregunta = preguntas[actual]
  const esUltima = actual === preguntas.length - 1

  if (!pregunta) return null

  async function handleSiguiente() {
    if (!respuestas[pregunta.id]?.trim()) return
    setEvaluando(true)

    try {
      const res = await fetch(`${API}/api/evaluar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: pregunta.id, texto: respuestas[pregunta.id] })
      })
      if (!res.ok) throw new Error("Error en API")
      const evaluacion = await res.json()
      setResultado(evaluacion)

      const sesionId = localStorage.getItem("sesionId")
      if (sesionId) {
        await fetch(`${API}/api/tarea4/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sesionId, pregunta: pregunta.id, texto: respuestas[pregunta.id], score: evaluacion.score, nivel: evaluacion.nivel })
        })
      }
    } catch {
      setResultado({ score: 0, nivel: "Error" })
    }

    setEvaluando(false)

    if (esUltima) {
      localStorage.setItem("respuestas_tarea4", JSON.stringify(respuestas))
      setTimeout(() => navigate("/resultado"), 1500)
    } else {
      setTimeout(() => {
        setActual(i => i + 1)
        setResultado(null)
      }, 1500)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#e8e4d9", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "680px", width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: "16px", padding: "48px" }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(212,168,67,0.6)", marginBottom: "6px" }}>Expediente — Fase IV</p>
          <p style={{ fontSize: "14px", color: "#d4a843", marginBottom: "20px", letterSpacing: "1px" }}>Autorregulación y Reflexión</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {preguntas.map((_, i) => (
              <div key={i} style={{ width: i === actual ? "24px" : "8px", height: "6px", borderRadius: "3px", background: i <= actual ? "#d4a843" : "rgba(212,168,67,0.15)", transition: "all .3s" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#d4a843", textTransform: "uppercase", whiteSpace: "nowrap" }}>Pregunta {actual + 1} de {preguntas.length}</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(212,168,67,0.2)" }} />
        </div>

        <h2 style={{ fontSize: "17px", lineHeight: 1.7, marginBottom: "28px", color: "rgba(232,228,217,0.9)" }}>{pregunta.texto}</h2>

        <textarea
          value={respuestas[pregunta.id] || ""}
          onChange={e => setRespuestas(prev => ({ ...prev, [pregunta.id]: e.target.value }))}
          placeholder="Reflexiona y escribe tu respuesta..."
          rows={7}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: "8px", padding: "16px", color: "#e8e4d9", fontSize: "14px", lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "'Georgia', serif", boxSizing: "border-box" }}
        />

        {resultado && (
          <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "8px", background: resultado.nivel === "Alto" ? "rgba(74,222,128,0.08)" : resultado.nivel === "Medio" ? "rgba(212,168,67,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${resultado.nivel === "Alto" ? "rgba(74,222,128,0.25)" : resultado.nivel === "Medio" ? "rgba(212,168,67,0.25)" : "rgba(248,113,113,0.25)"}`, display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(232,228,217,0.8)" }}>
            <span>Nivel: <strong style={{ color: resultado.nivel === "Alto" ? "#4ade80" : resultado.nivel === "Medio" ? "#d4a843" : "#f87171" }}>{resultado.nivel}</strong></span>
            <span>Score: <strong>{(resultado.score * 100).toFixed(0)}%</strong></span>
          </div>
        )}

        <div style={{ textAlign: "right", marginTop: "28px" }}>
          <button
            onClick={handleSiguiente}
            disabled={evaluando || !respuestas[pregunta.id]?.trim()}
            style={{ padding: "11px 36px", fontSize: "14px", background: evaluando || !respuestas[pregunta.id]?.trim() ? "transparent" : "rgba(212,168,67,0.1)", border: `1px solid ${evaluando || !respuestas[pregunta.id]?.trim() ? "rgba(212,168,67,0.15)" : "#d4a843"}`, color: evaluando || !respuestas[pregunta.id]?.trim() ? "rgba(212,168,67,0.3)" : "#d4a843", cursor: evaluando || !respuestas[pregunta.id]?.trim() ? "not-allowed" : "pointer", borderRadius: "6px", letterSpacing: "1px", fontFamily: "'Georgia', serif", transition: "all .2s" }}
          >
            {evaluando ? "Evaluando..." : esUltima ? "Ver Resultado Final →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </main>
  )
}
