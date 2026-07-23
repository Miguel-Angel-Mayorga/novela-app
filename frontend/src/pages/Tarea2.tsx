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

export default function Tarea2() {
  const navigate = useNavigate()
  const [decisiones, setDecisiones] = useState<Record<number, string>>({})

  const todasDecididas = Object.keys(decisiones).length === personajes.length

  function handleDecision(id: number, destino: string) {
    setDecisiones(prev => ({ ...prev, [id]: destino }))
  }

  async function handleContinuar() {
    try {
      const sesionId = localStorage.getItem("sesionId")
      if (sesionId) {
        await fetch(`${API}/api/tarea2/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sesionId,
            decisiones: Object.entries(decisiones).map(([id, decision]) => ({
              personajeId: Number(id),
              personajeNombre: personajes.find(p => p.id === Number(id))?.nombre || "",
              decision
            }))
          })
        })
      }
    } catch {
      console.error("Error guardando tarea2")
    }
    localStorage.setItem("decisiones_tarea2", JSON.stringify(decisiones))
    navigate("/tarea3")
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#e8e4d9", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "680px", width: "100%" }}>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(212,168,67,0.6)", marginBottom: "6px" }}>Expediente — Fase II</p>
          <h1 style={{ fontSize: "28px", fontWeight: "normal", color: "#d4a843", marginBottom: "12px" }}>El Momento del Juicio</h1>
          <p style={{ fontSize: "14px", color: "rgba(232,228,217,0.5)", lineHeight: 1.7 }}>
            Sin reglas divinas explícitas, deberás establecer tus propios criterios. Decide el destino de cada alma basándote en la evidencia analizada.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#d4a843", textTransform: "uppercase", whiteSpace: "nowrap" }}>Veredictos</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(212,168,67,0.2)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
          {personajes.map(p => {
            const decision = decisiones[p.id]
            return (
              <div key={p.id} style={{ background: decision === "Cielo" ? "rgba(147,197,253,0.06)" : decision === "Infierno" ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.02)", border: decision === "Cielo" ? "1px solid rgba(147,197,253,0.3)" : decision === "Infierno" ? "1px solid rgba(248,113,113,0.3)" : "1px solid rgba(212,168,67,0.1)", borderRadius: "10px", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", transition: "all .25s" }}>
                <div>
                  <div style={{ fontSize: "15px", marginBottom: "2px" }}>{p.nombre}</div>
                  <div style={{ fontSize: "12px", color: "rgba(232,228,217,0.35)", fontStyle: "italic" }}>{p.apodo}</div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                  <button onClick={() => handleDecision(p.id, "Cielo")} style={{ padding: "8px 18px", fontSize: "13px", background: decision === "Cielo" ? "rgba(147,197,253,0.15)" : "transparent", border: decision === "Cielo" ? "1px solid rgba(147,197,253,0.6)" : "1px solid rgba(255,255,255,0.1)", color: "#e8e4d9", cursor: "pointer", borderRadius: "6px", fontFamily: "'Georgia', serif", transition: "all .2s" }}>☁️ Cielo</button>
                  <button onClick={() => handleDecision(p.id, "Infierno")} style={{ padding: "8px 18px", fontSize: "13px", background: decision === "Infierno" ? "rgba(248,113,113,0.15)" : "transparent", border: decision === "Infierno" ? "1px solid rgba(248,113,113,0.6)" : "1px solid rgba(255,255,255,0.1)", color: "#e8e4d9", cursor: "pointer", borderRadius: "6px", fontFamily: "'Georgia', serif", transition: "all .2s" }}>🔥 Infierno</button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "rgba(232,228,217,0.3)", fontFamily: "sans-serif" }}>
            {Object.keys(decisiones).length} de {personajes.length} almas juzgadas
          </p>
          <button onClick={handleContinuar} disabled={!todasDecididas} style={{ padding: "11px 36px", fontSize: "14px", background: todasDecididas ? "rgba(212,168,67,0.1)" : "transparent", border: `1px solid ${todasDecididas ? "#d4a843" : "rgba(212,168,67,0.15)"}`, color: todasDecididas ? "#d4a843" : "rgba(212,168,67,0.3)", cursor: todasDecididas ? "pointer" : "not-allowed", borderRadius: "6px", letterSpacing: "1px", fontFamily: "'Georgia', serif", transition: "all .2s" }}>
            Continuar a Justificación →
          </button>
        </div>
      </div>
    </main>
  )
}
