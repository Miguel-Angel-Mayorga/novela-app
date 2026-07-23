import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import Home from "./pages/Home"
import Perfiles from "./pages/Perfiles"
import Tarea1 from "./pages/Tarea1"
import Tarea2 from "./pages/Tarea2"
import Tarea3 from "./pages/Tarea3"
import Tarea4 from "./pages/Tarea4"
import Resultado from "./pages/Resultado"

// Pistas del juego — se alternan en orden cuando una termina
const PISTAS_JUEGO = ["/ambiente1.mp3", "/ambiente2.mp3"]

// Determina la pista del resultado final leyendo las decisiones de localStorage
function getPistaResultado(): string {
  try {
    const saved = localStorage.getItem("decisiones_tarea2")
    const decisiones: Record<number, string> = saved ? JSON.parse(saved) : {}
    const cielo = Object.values(decisiones).filter(v => v === "Cielo").length
    const infierno = Object.values(decisiones).filter(v => v === "Infierno").length
    if (cielo >= 5) return "/final_misericordioso.mp3"
    if (infierno >= 5) return "/final_implacable.mp3"
    if (cielo === 3 && infierno === 3) return "/final_equilibrado.mp3"
    if (cielo > infierno) return "/final_benevolente.mp3"
    return "/final_severo.mp3"
  } catch {
    return "/ambiente1.mp3"
  }
}

function AudioGlobal() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volumen, setVolumen] = useState(0.4)
  const volumenRef = useRef(0.4)
  const [mostrarSlider, setMostrarSlider] = useState(false)
  const pistaIdx = useRef(0)
  const location = useLocation()
  const enHome = location.pathname === "/"
  const enResultado = location.pathname === "/resultado"
  const enHomeRef = useRef(enHome)

  function tocarPista(src: string) {
    const audio = audioRef.current
    if (!audio) return
    audio.src = src
    audio.volume = volumenRef.current
    audio.play().catch(() => {})
  }

  // Cambia de pista al terminar
  function handleEnded() {
    if (enHomeRef.current) {
      tocarPista("/Menu_Song.mp3")
    } else if (location.pathname === "/resultado") {
      // La pista del resultado se repite
      tocarPista(getPistaResultado())
    } else {
      pistaIdx.current = (pistaIdx.current + 1) % PISTAS_JUEGO.length
      tocarPista(PISTAS_JUEGO[pistaIdx.current])
    }
  }

  // Cambia la pista al cambiar de ruta
  useEffect(() => {
    if (enHome) {
      enHomeRef.current = true
      tocarPista("/Menu_Song.mp3")
    } else if (enResultado) {
      enHomeRef.current = false
      tocarPista(getPistaResultado())
    } else if (enHomeRef.current) {
      // Venía del Home — empezar ambiente desde el principio
      enHomeRef.current = false
      pistaIdx.current = 0
      tocarPista(PISTAS_JUEGO[0])
    }
  }, [location.pathname])

  // Primera interacción del usuario para sortear el bloqueo de autoplay
  useEffect(() => {
    function iniciarAudio() {
      const audio = audioRef.current
      if (!audio) return
      const src = enHomeRef.current ? "/Menu_Song.mp3" : PISTAS_JUEGO[0]
      if (!audio.src || audio.paused) {
        audio.src = src
        audio.volume = volumenRef.current
        audio.play().catch(() => {})
      }
      document.removeEventListener("click", iniciarAudio)
    }
    document.addEventListener("click", iniciarAudio)
    return () => document.removeEventListener("click", iniciarAudio)
  }, [])

  function cambiarVolumen(v: number) {
    volumenRef.current = v
    setVolumen(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <>
      <audio ref={audioRef} onEnded={handleEnded} />

      {/* Botón de volumen — visible en todas las páginas excepto Home */}
      {!enHome && (
        <div
          style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}
          onClick={e => e.stopPropagation()}
        >
          {mostrarSlider && (
            <div style={{ background: "rgba(13,13,20,0.95)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "14px" }}>🔈</span>
              <input
                type="range" min={0} max={1} step={0.05}
                value={volumen}
                onChange={e => cambiarVolumen(Number(e.target.value))}
                style={{ width: "90px", accentColor: "#d4a843" }}
              />
              <span style={{ fontSize: "14px" }}>🔊</span>
              <span style={{ fontSize: "12px", color: "#d4a843", minWidth: "30px" }}>{Math.round(volumen * 100)}%</span>
            </div>
          )}
          <button
            onClick={() => setMostrarSlider(s => !s)}
            style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(13,13,20,0.9)", border: "1px solid rgba(212,168,67,0.25)", color: "#e8e4d9", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {volumen === 0 ? "🔇" : volumen < 0.5 ? "🔈" : "🔊"}
          </button>
        </div>
      )}
    </>
  )
}

function AppInner() {
  return (
    <>
      <AudioGlobal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfiles" element={<Perfiles />} />
        <Route path="/tarea1" element={<Tarea1 />} />
        <Route path="/tarea2" element={<Tarea2 />} />
        <Route path="/tarea3" element={<Tarea3 />} />
        <Route path="/tarea4" element={<Tarea4 />} />
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
