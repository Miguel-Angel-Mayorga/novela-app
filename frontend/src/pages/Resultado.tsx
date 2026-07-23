import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"

const personajes = [
  { id: 1, nombre: "Elena Rojas" },
  { id: 2, nombre: "Ricardo Vargas" },
  { id: 3, nombre: "Sofía Rojas" },
  { id: 4, nombre: "Marcos Fuentes" },
  { id: 5, nombre: "Dr. Andrés García" },
  { id: 6, nombre: "Concejal Morales" }
]

function loadJustificaciones(): Record<number, string> {
  try {
    const saved = localStorage.getItem("justificaciones_tarea3")
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function loadSavedDecisions(): Record<number, string> {
  try {
    const saved = localStorage.getItem("decisiones_tarea2")
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

const seccion = (titulo: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
    <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#d4a843", textTransform: "uppercase", whiteSpace: "nowrap" }}>{titulo}</span>
    <div style={{ flex: 1, height: "1px", background: "rgba(212,168,67,0.2)" }} />
  </div>
)

export default function Resultado() {
  const navigate = useNavigate()
  const [decisiones] = useState<Record<number, string>>(loadSavedDecisions)
  const [analisisIA, setAnalisisIA] = useState<Record<number, string>>({})
  const [cargandoAnalisis, setCargandoAnalisis] = useState(true)

  const totalCielo = Object.values(decisiones).filter(v => v === "Cielo").length
  const totalInfierno = Object.values(decisiones).filter(v => v === "Infierno").length

  function getPerfil() {
    if (totalCielo >= 5) return { titulo: "El Misericordioso", descripcion: "Tu juicio está guiado por la compasión. Tiendes a ver el potencial de redención en las personas, incluso cuando la evidencia es contradictoria. Valoras las intenciones por encima de los resultados.", color: "#93c5fd" }
    if (totalInfierno >= 5) return { titulo: "El Implacable", descripcion: "Tu juicio es estricto y sin concesiones. Confías en los hechos concretos y no te dejas llevar por las circunstancias atenuantes. Para ti, las acciones hablan más que las palabras.", color: "#f87171" }
    if (totalCielo === 3 && totalInfierno === 3) return { titulo: "El Equilibrado", descripcion: "Tu juicio es matizado y reflexivo. Eres capaz de reconocer la complejidad moral de cada caso sin caer en extremos. Evalúas cada situación con criterios propios y consistentes.", color: "#d4a843" }
    if (totalCielo > totalInfierno) return { titulo: "El Benevolente", descripcion: "Tu juicio tiende hacia la clemencia. Reconoces las circunstancias que rodean las acciones humanas y das el beneficio de la duda cuando la evidencia es ambigua.", color: "#86efac" }
    return { titulo: "El Severo", descripcion: "Tu juicio tiende hacia la justicia estricta. Consideras que las acciones tienen consecuencias y que la responsabilidad personal es fundamental, independientemente del contexto.", color: "#f97316" }
  }

  const perfil = getPerfil()

  useEffect(() => {
    async function guardarResultado() {
      const sesionId = localStorage.getItem("sesionId")
      if (!sesionId) return
      try {
        await fetch(`${API}/api/resultado/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sesionId, perfil: perfil.titulo, totalCielo, totalInfierno })
        })
      } catch { console.error("Error guardando resultado") }
    }

    async function generarAnalisis() {
      const justificaciones = loadJustificaciones()
      const datos = personajes.map(p => ({
        id: p.id,
        nombre: p.nombre,
        decision: decisiones[p.id] || "Sin decisión",
        justificacion: justificaciones[p.id] || "Sin justificación"
      }))
      try {
        const res = await fetch(`${API}/api/resultado/analizar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personajes: datos })
        })
        const data: { id: number; analisis: string }[] = await res.json()
        const mapa: Record<number, string> = {}
        data.forEach(item => { mapa[item.id] = item.analisis })
        setAnalisisIA(mapa)
      } catch {
        console.error("Error generando análisis IA")
      } finally {
        setCargandoAnalisis(false)
      }
    }

    guardarResultado()
    generarAnalisis()
  }, [])

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#e8e4d9", fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: "720px", width: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(212,168,67,0.6)", marginBottom: "8px" }}>Expediente — Resultado Final</p>
          <p style={{ fontSize: "13px", color: "rgba(232,228,217,0.4)" }}>Análisis de tu perfil de juicio moral</p>
        </div>

        {/* Perfil */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${perfil.color}33`, borderRadius: "16px", padding: "40px", marginBottom: "32px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `${perfil.color}18`, border: `1px solid ${perfil.color}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>⚖️</div>
          <h1 style={{ fontSize: "26px", fontWeight: "normal", color: perfil.color, marginBottom: "16px", letterSpacing: "1px" }}>{perfil.titulo}</h1>
          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(232,228,217,0.7)", maxWidth: "480px", margin: "0 auto 24px" }}>{perfil.descripcion}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "48px" }}>
            <div>
              <div style={{ fontSize: "32px", color: "#93c5fd", fontWeight: "normal" }}>{totalCielo}</div>
              <div style={{ fontSize: "11px", color: "rgba(232,228,217,0.35)", letterSpacing: "1px" }}>al Cielo</div>
            </div>
            <div style={{ width: "1px", background: "rgba(212,168,67,0.15)" }} />
            <div>
              <div style={{ fontSize: "32px", color: "#f87171", fontWeight: "normal" }}>{totalInfierno}</div>
              <div style={{ fontSize: "11px", color: "rgba(232,228,217,0.35)", letterSpacing: "1px" }}>al Infierno</div>
            </div>
          </div>
        </div>

        {/* Veredictos + análisis */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,168,67,0.12)", borderRadius: "16px", padding: "32px", marginBottom: "32px" }}>
          {seccion("Tus Veredictos y Análisis")}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {personajes.map((p, i) => {
              const decision = decisiones[p.id] as "Cielo" | "Infierno"
              const texto = analisisIA[p.id]
              return (
                <div key={p.id} style={{ paddingTop: i === 0 ? "0" : "20px", paddingBottom: "20px", borderBottom: i < personajes.length - 1 ? "1px solid rgba(212,168,67,0.08)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px" }}>{p.nombre}</span>
                    <span style={{ fontSize: "12px", color: decision === "Cielo" ? "#93c5fd" : "#f87171", flexShrink: 0, marginLeft: "16px" }}>
                      {decision === "Cielo" ? "☁️ Cielo" : "🔥 Infierno"}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(232,228,217,0.45)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                    {cargandoAnalisis ? "Generando análisis..." : (texto || "")}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "11px 48px", fontSize: "14px", background: "rgba(212,168,67,0.1)", border: "1px solid #d4a843", color: "#d4a843", cursor: "pointer", borderRadius: "6px", letterSpacing: "1px", fontFamily: "'Georgia', serif", transition: "all .2s" }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </main>
  )
}
