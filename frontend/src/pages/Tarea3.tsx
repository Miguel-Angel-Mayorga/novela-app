import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"

const personajes = [
  { id: 1, nombre: "Elena Rojas",       apodo: "La Pacificadora" },
  { id: 2, nombre: "Ricardo Vargas",    apodo: "El Pragmático" },
  { id: 3, nombre: "Sofía Rojas",       apodo: "La Silenciosa" },
  { id: 4, nombre: "Marcos Fuentes",    apodo: "El Idealista" },
  { id: 5, nombre: "Dr. Andrés García", apodo: "El Benefactor" },
  { id: 6, nombre: "Concejal Morales",  apodo: "El Influyente" }
]

function loadSavedDecisions(): Record<number, string> {
  try {
    const saved = localStorage.getItem("decisiones_tarea2")
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export default function Tarea3() {
  const navigate = useNavigate()
  const [decisiones] = useState<Record<number, string>>(loadSavedDecisions)
  const [justificaciones, setJustificaciones] = useState<Record<number, string>>({})
  const [actual, setActual] = useState(0)

  const personaje = personajes[actual]
  const esUltimo = actual === personajes.length - 1

  if (!personaje) return null

  async function handleContinuar() {
    if (!justificaciones[personaje.id]?.trim()) return

    if (esUltimo) {
      try {
        const sesionId = localStorage.getItem("sesionId")
        if (sesionId) {
          await fetch(`${API}/api/tarea3/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sesionId,
              justificaciones: Object.entries(justificaciones).map(([id, texto]) => ({
                personajeId: Number(id),
                personajeNombre: personajes.find(p => p.id === Number(id))?.nombre || "",
                texto
              }))
            })
          })
        }
      } catch {
        console.error("Error guardando tarea3")
      }
      localStorage.setItem("justificaciones_tarea3", JSON.stringify(justificaciones))
      navigate("/tarea4")
    } else {
      setActual(i => i + 1)
    }
  }

  const decision = decisiones[personaje.id]

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#e8e4d9", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "680px", width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: "16px", padding: "48px" }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(212,168,67,0.6)", marginBottom: "6px" }}>Expediente — Fase III</p>
          <p style={{ fontSize: "14px", color: "#d4a843", marginBottom: "20px", letterSpacing: "1px" }}>Explicación y Justificación</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {personajes.map((_, i) => (
              <div key={i} style={{ width: i === actual ? "24px" : "8px", height: "6px", borderRadius: "3px", background: i <= actual ? "#d4a843" : "rgba(212,168,67,0.15)", transition: "all .3s" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#d4a843", textTransform: "uppercase", whiteSpace: "nowrap" }}>Justificación {actual + 1} de {personajes.length}</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(212,168,67,0.2)" }} />
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "normal", marginBottom: "4px" }}>{personaje.nombre}</h2>
            <p style={{ fontSize: "13px", color: "rgba(232,228,217,0.4)", fontStyle: "italic" }}>{personaje.apodo}</p>
          </div>
          {decision && (
            <div style={{ padding: "6px 16px", borderRadius: "50px", background: decision === "Cielo" ? "rgba(147,197,253,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${decision === "Cielo" ? "rgba(147,197,253,0.35)" : "rgba(248,113,113,0.35)"}`, fontSize: "13px", color: decision === "Cielo" ? "#93c5fd" : "#f87171" }}>
              {decision === "Cielo" ? "☁️ Cielo" : "🔥 Infierno"}
            </div>
          )}
        </div>

        <p style={{ fontSize: "13px", color: "rgba(232,228,217,0.45)", marginBottom: "16px", lineHeight: 1.7 }}>
          Explica detalladamente el razonamiento detrás de tu decisión. Haz referencia específica a la información de los perfiles.
        </p>

        <textarea
          value={justificaciones[personaje.id] || ""}
          onChange={e => setJustificaciones(prev => ({ ...prev, [personaje.id]: e.target.value }))}
          placeholder="Escribe tu justificación aquí..."
          rows={7}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: "8px", padding: "16px", color: "#e8e4d9", fontSize: "14px", lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "'Georgia', serif", boxSizing: "border-box" }}
        />

        <div style={{ textAlign: "right", marginTop: "28px" }}>
          <button
            onClick={handleContinuar}
            disabled={!justificaciones[personaje.id]?.trim()}
            style={{ padding: "11px 36px", fontSize: "14px", background: !justificaciones[personaje.id]?.trim() ? "transparent" : "rgba(212,168,67,0.1)", border: `1px solid ${!justificaciones[personaje.id]?.trim() ? "rgba(212,168,67,0.15)" : "#d4a843"}`, color: !justificaciones[personaje.id]?.trim() ? "rgba(212,168,67,0.3)" : "#d4a843", cursor: !justificaciones[personaje.id]?.trim() ? "not-allowed" : "pointer", borderRadius: "6px", letterSpacing: "1px", fontFamily: "'Georgia', serif", transition: "all .2s" }}
          >
            {esUltimo ? "Finalizar Fase III →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </main>
  )
}
