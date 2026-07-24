import { useState } from "react"
import { useNavigate } from "react-router-dom"

const perfiles = [
  {
    id: 1,
    nombre: "Elena Rojas",
    apodo: "La Pacificadora",
    imagen: "/elena.png",
    descripcion: "Psicóloga infantil de 45 años, conocida por su trabajo comunitario en zonas desfavorecidas. Apasionada por la resolución de conflictos y la mediación. Vive con su hermana menor, Sofía.",
    acciones: [
      "Organizó una protesta pacífica contra la construcción de un centro comercial en un parque local.",
      "Fue voluntaria en un albergue para personas sin hogar durante 10 años.",
      "Donó anónimamente una gran suma de dinero a una fundación que apoya a víctimas de violencia."
    ],
    creencia: "\"La verdad siempre encuentra su camino, pero el proceso es lo que define el alma.\"",
    citas: [
      { texto: "Elena siempre busca el bien mayor, incluso si eso significa ir en contra de la corriente.", autor: "Incógnito", tipo: "favorable" },
      { texto: "Ella es una manipuladora con una sonrisa. Siempre consigue lo que quiere.", autor: "Antiguo colega", tipo: "critica" }
    ],
    ambiguo: "Se le vio reunirse en secreto con un desarrollador inmobiliario poco antes de la protesta contra el centro comercial."
  },
  {
    id: 2,
    nombre: "Ricardo Vargas",
    apodo: "El Pragmático",
    imagen: "/ricardo.png",
    descripcion: "Empresario exitoso de 52 años. Conocido por su capacidad de adaptarse a cualquier entorno y sacar provecho de las situaciones.",
    acciones: [
      "Financió campañas políticas de varios candidatos simultáneamente.",
      "Cerró una fábrica dejando a 200 empleados sin trabajo para abrir una más rentable.",
      "Donó equipos médicos a un hospital público."
    ],
    creencia: "\"Los resultados justifican los métodos, siempre que nadie salga lastimado innecesariamente.\"",
    citas: [
      { texto: "Ricardo es un hombre de negocios brillante, muy generoso con quienes lo rodean.", autor: "Socio comercial", tipo: "favorable" },
      { texto: "Solo piensa en su beneficio. Sus donaciones son pura imagen.", autor: "Ex empleado", tipo: "critica" }
    ],
    ambiguo: "Tiene vínculos financieros con el Concejal Morales, aunque ambos niegan cualquier acuerdo formal."
  },
  {
    id: 3,
    nombre: "Sofía Rojas",
    apodo: "La Silenciosa",
    imagen: "/sofia.png",
    descripcion: "Hermana menor de Elena, 38 años. Trabaja como contadora en una empresa privada. De personalidad reservada y metódica.",
    acciones: [
      "Manejó las finanzas de la fundación donde Elena donó dinero.",
      "Se negó a declarar ante las autoridades cuando fue citada.",
      "Transfirió fondos entre cuentas días antes de la protesta."
    ],
    creencia: "\"Hay cosas que es mejor no decir en voz alta.\"",
    citas: [
      { texto: "Sofía es discreta y profesional, nunca ha dado motivos de queja.", autor: "Jefe directo", tipo: "favorable" },
      { texto: "Sabe más de lo que dice. Siempre ha sido así.", autor: "Elena Rojas", tipo: "critica" }
    ],
    ambiguo: "Las transferencias que realizó no tienen una justificación clara en los registros de la fundación."
  },
  {
    id: 4,
    nombre: "Marcos Fuentes",
    apodo: "El Idealista",
    imagen: "/marcos.png",
    descripcion: "Activista ambiental y académico de 41 años. Profesor universitario con publicaciones sobre ética empresarial y medio ambiente.",
    acciones: [
      "Lideró múltiples protestas contra proyectos de construcción en zonas verdes.",
      "Rechazó una oferta laboral de alto perfil en una empresa constructora.",
      "Publicó un artículo señalando irregularidades en contratos del Concejal Morales."
    ],
    creencia: "\"El conocimiento sin acción es complicidad.\"",
    citas: [
      { texto: "Marcos es incorruptible, uno de los pocos académicos que practica lo que predica.", autor: "Colega universitario", tipo: "favorable" },
      { texto: "Su obsesión con el Concejal parece personal, no académica.", autor: "Estudiante", tipo: "critica" }
    ],
    ambiguo: "Tuvo una relación cercana con Elena Rojas años atrás, antes de que ella iniciara la protesta."
  },
  {
    id: 5,
    nombre: "Dr. Andrés García",
    apodo: "El Benefactor",
    imagen: "/dr_garcia.png",
    descripcion: "Médico cirujano de 67 años, director de una fundación de salud para comunidades vulnerables. Reconocido por su labor humanitaria.",
    acciones: [
      "Fundó tres clínicas gratuitas en zonas marginadas.",
      "Recibió una donación anónima millonaria que permitió expandir su fundación.",
      "Contrató a familiares de políticos locales como parte de su equipo administrativo."
    ],
    creencia: "\"Sanar no es solo medicina, es justicia social.\"",
    citas: [
      { texto: "El doctor García es un santo, ha salvado miles de vidas.", autor: "Paciente", tipo: "favorable" },
      { texto: "Su fundación es intachable en lo médico, pero su administración tiene zonas grises.", autor: "Auditor externo", tipo: "critica" }
    ],
    ambiguo: "La donación anónima que recibió coincide en monto con una transferencia realizada por Sofía Rojas."
  },
  {
    id: 6,
    nombre: "Concejal Morales",
    apodo: "El Influyente",
    imagen: "/morales.png",
    descripcion: "Político de 45 años con 15 años en el concejo municipal. Conocido por su capacidad de negociación y sus amplias redes de contacto.",
    acciones: [
      "Votó a favor de un proyecto de construcción en el parque local.",
      "Promovió una ley de transparencia en contratos públicos.",
      "Bloqueó una investigación sobre irregularidades en licitaciones."
    ],
    creencia: "\"El poder no se pide, se construye ladrillo a ladrillo.\"",
    citas: [
      { texto: "Es el político más efectivo que hemos tenido. Sabe mover las piezas.", autor: "Colega del concejo", tipo: "favorable" },
      { texto: "Sus votos siempre benefician a las mismas empresas. No es casualidad.", autor: "Periodista investigativo", tipo: "critica" }
    ],
    ambiguo: "Su esposa tiene acciones en la constructora beneficiada por su voto a favor del proyecto."
  }
]

type LineaDialogo = {
  hablante: string
  texto: string
  avatar: "personaje" | "generico"
  personajeIndex: number
}

// Convierte cada perfil en una secuencia de líneas de diálogo:
// el expediente presenta al personaje y sus acciones, el personaje habla con
// su propia cita, y los terceros aportan sus testimonios.
function construirDialogo(perfil: typeof perfiles[number], personajeIndex: number): LineaDialogo[] {
  const lineas: LineaDialogo[] = []

  lineas.push({
    hablante: "Expediente",
    texto: `${perfil.nombre} — "${perfil.apodo}". ${perfil.descripcion}`,
    avatar: "generico",
    personajeIndex
  })

  perfil.acciones.forEach(a => lineas.push({ hablante: "Expediente", texto: a, avatar: "generico", personajeIndex }))

  lineas.push({ hablante: perfil.nombre, texto: perfil.creencia, avatar: "personaje", personajeIndex })

  perfil.citas.forEach(c => lineas.push({ hablante: c.autor, texto: c.texto, avatar: "generico", personajeIndex }))

  lineas.push({ hablante: "Expediente", texto: perfil.ambiguo, avatar: "generico", personajeIndex })

  return lineas
}

const dialogoCompleto: LineaDialogo[] = perfiles.flatMap((p, i) => construirDialogo(p, i))

function IconoPersona() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="#e8e4d9">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5c0-4.4 3.6-7 8-7s8 2.6 8 7V21H4v-.5z" />
    </svg>
  )
}

function IconoFlecha({ direccion = "der" as "der" | "izq" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0d0d14" strokeWidth={2.5}
      style={{ transform: direccion === "izq" ? "rotate(180deg)" : undefined }}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Perfiles() {
  const navigate = useNavigate()
  const [indice, setIndice] = useState(0)

  const linea = dialogoCompleto[indice]
  const perfilActual = perfiles[linea.personajeIndex]
  const esUltima = indice === dialogoCompleto.length - 1
  const esPrimera = indice === 0

  function siguiente() {
    if (esUltima) {
      navigate("/tarea1")
      return
    }
    setIndice(i => i + 1)
  }

  function anterior() {
    if (!esPrimera) setIndice(i => i - 1)
  }

  return (
    <main style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden", background: "#0d0d14", fontFamily: "'Georgia', serif" }}>
      <video
        src="/Final_Render.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,20,0.55) 0%, rgba(13,13,20,0) 40%)" }} />

      {/* Progreso */}
      <div style={{
        position: "absolute", top: "24px", right: "32px",
        fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
        color: "rgba(232,228,217,0.75)",
        background: "rgba(13,13,20,0.5)", padding: "6px 16px", borderRadius: "20px",
        border: "1px solid rgba(212,168,67,0.3)"
      }}>
        Personaje {linea.personajeIndex + 1} / {perfiles.length}
      </div>

      {/* Cuadro de diálogo */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "min(4vh, 48px)", width: "min(92vw, 1040px)" }}>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
          <button
            onClick={anterior}
            disabled={esPrimera}
            style={{
              width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, marginBottom: "12px",
              background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.5)",
              cursor: esPrimera ? "default" : "pointer", opacity: esPrimera ? 0.35 : 1,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#d4a843" strokeWidth={2.5}>
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{
            display: "inline-block",
            background: "linear-gradient(to right, rgba(58,20,68,0.95) 0%, #0a0610 75%)",
            border: "3px solid #d4a843",
            borderBottom: "none",
            padding: "14px 40px 14px 106px",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)",
            fontSize: "16px", color: "#e8e4d9", letterSpacing: "0.5px"
          }}>
            {linea.hablante}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "stretch", position: "relative" }}>
          {/* Avatar */}
          <div style={{
            width: "92px", height: "92px", borderRadius: "50%",
            background: "#0a0610", border: "3px solid #d4a843",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginRight: "-46px", zIndex: 2, marginTop: "26px",
            overflow: "hidden", boxShadow: "0 0 0 5px #0d0d14"
          }}>
            {linea.avatar === "personaje" ? (
              <img src={perfilActual.imagen} alt={perfilActual.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <IconoPersona />
            )}
          </div>

          {/* Caja de texto */}
          <div style={{
            flex: 1,
            background: "radial-gradient(ellipse at 25% 15%, #33163c 0%, #0a0610 68%)",
            border: "3px solid #d4a843",
            clipPath: "polygon(0 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%)",
            padding: "36px 72px 36px 106px",
            minHeight: "210px",
            display: "flex",
            alignItems: "flex-start"
          }}>
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "rgba(232,228,217,0.92)", margin: 0 }}>
              {linea.texto}
            </p>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={siguiente}
            style={{
              position: "absolute", right: "-22px", top: "50%", transform: "translateY(-50%)",
              width: "44px", height: "44px", borderRadius: "50%",
              background: "#d4a843", border: "1px solid #f0cf7a",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 4px #0d0d14"
            }}
          >
            <IconoFlecha />
          </button>
        </div>
      </div>
    </main>
  )
}
