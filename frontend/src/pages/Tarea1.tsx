import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"

const preguntas = [
  { id: 1, texto: "¿Qué individuos presentan un conflicto de intereses claro o potencial? ¿Por qué?" },
  { id: 2, texto: "¿Qué acciones de Elena Rojas, Sofía Rojas y Ricardo Vargas sugieren que podrían tener motivaciones más allá de las que declaran públicamente?" },
  { id: 3, texto: "Si tuvieras que investigar más a fondo, ¿qué testimonios considerarías más creíbles y cuáles menos? ¿Por qué?" },
  { id: 4, texto: "Describe un patrón de comportamiento que identifiques en al menos dos de los individuos." },
  { id: 5, texto: "¿Qué información adicional consideras crucial para tener una comprensión más completa de la situación?" },
  { id: 6, texto: "Basándote en la información, construye una breve narrativa sobre lo que crees que realmente ocurrió." }
]

export default function Tarea1() {
  const navigate = useNavigate()
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [textoActual, setTextoActual] = useState("")
  const [evaluando, setEvaluando] = useState(false)
  const [resultado, setResultado] = useState<{ score: number; nivel: string } | null>(null)

  const pregunta = preguntas[preguntaActual]
  const esUltima = preguntaActual === preguntas.length - 1

  if (!pregunta) return null

  async function handleSiguiente() {
    if (!textoActual.trim()) return
    setEvaluando(true)

    try {
      const res = await fetch(`${API}/api/evaluar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: pregunta.id, texto: textoActual })
      })
      if (!res.ok) throw new Error("Error en API")
      const evaluacion = await res.json()
      setResultado(evaluacion)

      const sesionId = localStorage.getItem("sesionId")
      if (sesionId) {
        await fetch(`${API}/api/tarea1/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sesionId, pregunta: pregunta.id, texto: textoActual, score: evaluacion.score, nivel: evaluacion.nivel })
        })
      }
    } catch {
      setResultado({ score: 0, nivel: "Error" })
    }

    setEvaluando(false)

    if (esUltima) {
      setTimeout(() => navigate("/tarea2"), 1500)
    } else {
      setTimeout(() => {
        setPreguntaActual(i => i + 1)
        setTextoActual("")
        setResultado(null)
      }, 1500)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#e8e4d9", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "680px", width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: "16px", padding: "48px" }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(212,168,67,0.6)", marginBottom: "6px" }}>Expediente — Fase I</p>
          <p style={{ fontSize: "14px", color: "#d4a843", marginBottom: "20px", letterSpacing: "1px" }}>Interpretación y Análisis</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {preguntas.map((_, i) => (
              <div key={i} style={{ width: i === preguntaActual ? "24px" : "8px", height: "6px", borderRadius: "3px", background: i <= preguntaActual ? "#d4a843" : "rgba(212,168,67,0.15)", transition: "all .3s" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#d4a843", textTransform: "uppercase", whiteSpace: "nowrap" }}>Pregunta {preguntaActual + 1} de {preguntas.length}</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(212,168,67,0.2)" }} />
        </div>

        <h2 style={{ fontSize: "17px", lineHeight: 1.7, marginBottom: "28px", color: "rgba(232,228,217,0.9)" }}>{pregunta.texto}</h2>

        <textarea
          value={textoActual}
          onChange={e => setTextoActual(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          rows={6}
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
            disabled={evaluando || !textoActual.trim()}
            style={{ padding: "11px 36px", fontSize: "14px", background: evaluando || !textoActual.trim() ? "transparent" : "rgba(212,168,67,0.1)", border: `1px solid ${evaluando || !textoActual.trim() ? "rgba(212,168,67,0.15)" : "#d4a843"}`, color: evaluando || !textoActual.trim() ? "rgba(212,168,67,0.3)" : "#d4a843", cursor: evaluando || !textoActual.trim() ? "not-allowed" : "pointer", borderRadius: "6px", letterSpacing: "1px", fontFamily: "'Georgia', serif", transition: "all .2s" }}
          >
            {evaluando ? "Evaluando..." : esUltima ? "Finalizar Fase I →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </main>
  )
}
