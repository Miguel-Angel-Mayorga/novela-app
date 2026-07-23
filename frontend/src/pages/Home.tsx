import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"

type Modal = "acerca" | "ayuda" | null

const estiloModal: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Georgia', serif"
}

const estiloContenido: React.CSSProperties = {
  background: "#0d0d14",
  border: "1px solid rgba(212,168,67,0.2)",
  borderRadius: "16px",
  padding: "40px",
  maxWidth: "480px",
  width: "90%",
  color: "#e8e4d9",
  position: "relative"
}

const estiloTitulo: React.CSSProperties = {
  fontSize: "9px",
  letterSpacing: "3px",
  textTransform: "uppercase",
  color: "rgba(212,168,67,0.6)",
  marginBottom: "20px"
}

const estiloCerrar: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  right: "20px",
  background: "none",
  border: "none",
  color: "rgba(232,228,217,0.3)",
  fontSize: "20px",
  cursor: "pointer"
}

export default function Home() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [introTerminada, setIntroTerminada] = useState(false)
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [modal, setModal] = useState<Modal>(null)

  function handleIntroEnd() {
    setIntroTerminada(true)
    setTimeout(() => setMostrarMenu(true), 300)
  }

  function cerrarModal(e: React.MouseEvent) {
    if (e.target === e.currentTarget) setModal(null)
  }

  return (
    <main style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white", fontFamily: "'Georgia', serif", background: "#0d0d14" }}>
      <video
        ref={videoRef}
        src={introTerminada ? "/Video_Loop.mp4" : "/Video.mp4"}
        autoPlay
        loop={introTerminada}
        muted
        playsInline
        onEnded={!introTerminada ? handleIntroEnd : undefined}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />

      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", opacity: mostrarMenu ? 1 : 0, transform: mostrarMenu ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
        <img className="logo" src="/ImagenMenu.png" alt="Logo" style={{ width: "500px", padding: "12px 0" }} />

        {[
          { key: "comenzar", src: "/Group6.png", onClick: async () => {
            localStorage.removeItem("sesionId")
            localStorage.removeItem("decisiones_tarea2")
            localStorage.removeItem("justificaciones_tarea3")
            localStorage.removeItem("respuestas_tarea4")
            const res = await fetch(`${API}/api/sesion`, { method: "POST" })
            const data = await res.json()
            localStorage.setItem("sesionId", data.sesionId)
            navigate("/perfiles")
          }},
          { key: "acerca", src: "/Group3.png", onClick: (e: React.MouseEvent) => { e.stopPropagation(); setModal("acerca") } },
          { key: "ayuda",  src: "/Group2.png", onClick: (e: React.MouseEvent) => { e.stopPropagation(); setModal("ayuda") } },
        ].map(({ key, src, onClick }) => (
          <img key={key} src={src} alt={key} onClick={onClick as () => void} className="btn-menu"
            style={{ cursor: "pointer", width: "220px" }} />
        ))}
      </div>

      {/* Modal Acerca de */}
      {modal === "acerca" && (
        <div style={estiloModal} onClick={cerrarModal}>
          <div style={estiloContenido}>
            <button style={estiloCerrar} onClick={() => setModal(null)}>✕</button>
            <p style={estiloTitulo}>Acerca de</p>
            <h2 style={{ fontSize: "20px", marginBottom: "8px", color: "#d4a843", fontWeight: "normal" }}>Sombras de la Verdad</h2>
            <p style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(232,228,217,0.7)", marginBottom: "16px" }}>
              Un juego de razonamiento moral inspirado en la <em>Divina Comedia</em> de Dante Alighieri. El jugador asume el rol de juez y debe analizar, decidir y justificar el destino de seis personajes moralmente ambiguos.
            </p>
            <p style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(232,228,217,0.7)", marginBottom: "20px" }}>
              Diseñado como herramienta educativa para evaluar el razonamiento moral y la toma de decisiones en contextos de ambigüedad ética.
            </p>
            <div style={{ borderTop: "1px solid rgba(212,168,67,0.15)", paddingTop: "16px", fontSize: "12px", color: "rgba(232,228,217,0.3)" }}>
              Corporación Unificada Nacional (CUN) · 2026
            </div>
          </div>
        </div>
      )}

      {/* Modal Ayuda */}
      {modal === "ayuda" && (
        <div style={estiloModal} onClick={cerrarModal}>
          <div style={estiloContenido}>
            <button style={estiloCerrar} onClick={() => setModal(null)}>✕</button>
            <p style={estiloTitulo}>¿Cómo jugar?</p>
            {[
              { n: "1", titulo: "Lee los perfiles", desc: "Conoce a los 6 personajes y analiza sus acciones, creencias y testimonios." },
              { n: "2", titulo: "Responde el análisis", desc: "Contesta 6 preguntas sobre los personajes. Tus respuestas se evalúan por argumentación y profundidad." },
              { n: "3", titulo: "Dicta tu veredicto", desc: "Decide si cada personaje merece el Cielo o el Infierno según tu juicio moral." },
              { n: "4", titulo: "Justifica tus decisiones", desc: "Explica detalladamente por qué tomaste cada decisión, referenciando los perfiles." },
              { n: "5", titulo: "Reflexiona", desc: "Responde preguntas finales sobre tu proceso de razonamiento." },
              { n: "★", titulo: "Descubre tu perfil", desc: "Obtén un análisis personalizado de tu estilo de juicio moral." },
            ].map(paso => (
              <div key={paso.n} style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#d4a843", flexShrink: 0 }}>{paso.n}</div>
                <div>
                  <p style={{ fontSize: "13px", marginBottom: "2px", color: "#e8e4d9" }}>{paso.titulo}</p>
                  <p style={{ fontSize: "12px", color: "rgba(232,228,217,0.5)", lineHeight: 1.6 }}>{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
