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
      { texto: "Elena siempre busca el bien mayor, incluso si eso significa ir en contra de la corriente.", autor: "Vecino", tipo: "favorable" },
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

function iniciales(nombre: string) {
  return nombre.split(" ").filter((_, i) => i === 0 || i === nombre.split(" ").length - 1).map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

const seccion = (titulo: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
    <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#d4a843", textTransform: "uppercase", whiteSpace: "nowrap" }}>{titulo}</span>
    <div style={{ flex: 1, height: "1px", background: "rgba(212,168,67,0.25)" }} />
  </div>
)

export default function Perfiles() {
  const navigate = useNavigate()
  const [perfilActivo, setPerfilActivo] = useState(0)
  const [leidos, setLeidos] = useState<number[]>([0])

  const perfil = perfiles[perfilActivo]
  const todosLeidos = leidos.length === perfiles.length

  function handleSeleccionar(i: number) {
    setPerfilActivo(i)
    if (!leidos.includes(i)) setLeidos(prev => [...prev, i])
  }

  function handleComenzar() {
    if (!todosLeidos) {
      const siguiente = (perfilActivo + 1) % perfiles.length
      handleSeleccionar(siguiente)
      return
    }
    navigate("/tarea1")
  }

  return (
    <main style={{ height: "100vh", display: "flex", background: "#0d0d14", color: "#e8e4d9", fontFamily: "'Georgia', serif", overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: "200px", borderRight: "1px solid rgba(212,168,67,0.15)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 16px 16px", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
          <p style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(212,168,67,0.6)", textTransform: "uppercase", marginBottom: "2px" }}>Expediente</p>
          <p style={{ fontSize: "13px", color: "#d4a843", letterSpacing: "1px" }}>Perfiles</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {perfiles.map((p, i) => {
            const activo = perfilActivo === i
            const leido = leidos.includes(i)
            return (
              <button key={p.id} onClick={() => handleSeleccionar(i)} style={{ width: "100%", background: activo ? "rgba(212,168,67,0.1)" : "transparent", border: activo ? "1px solid rgba(212,168,67,0.3)" : "1px solid transparent", borderRadius: "8px", padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", textAlign: "left", transition: "all .2s" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: activo ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${activo ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", color: activo ? "#d4a843" : "rgba(255,255,255,0.4)", flexShrink: 0, fontFamily: "sans-serif" }}>
                  {iniciales(p.nombre)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "12px", color: activo ? "#e8e4d9" : "rgba(232,228,217,0.6)", fontWeight: activo ? "bold" : "normal", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</div>
                  <div style={{ fontSize: "10px", color: "rgba(232,228,217,0.35)", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.apodo}</div>
                </div>
                {leido && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", flexShrink: 0, marginLeft: "auto" }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Columna info */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 48px 60px", borderRight: "1px solid rgba(212,168,67,0.1)" }}>

        <p style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(212,168,67,0.6)", textTransform: "uppercase", marginBottom: "12px" }}>
          Perfil {perfil.id} de {perfiles.length}
        </p>
        <h1 style={{ fontSize: "38px", fontWeight: "normal", marginBottom: "4px", letterSpacing: "1px" }}>{perfil.nombre}</h1>
        <p style={{ fontSize: "15px", color: "#d4a843", fontStyle: "italic", marginBottom: "32px" }}>{perfil.apodo}</p>

        <div style={{ marginBottom: "32px" }}>
          {seccion("Descripción General")}
          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(232,228,217,0.8)" }}>{perfil.descripcion}</p>
        </div>

        <div style={{ marginBottom: "32px" }}>
          {seccion("Acciones Significativas")}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {perfil.acciones.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "14px 16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "11px", color: "#d4a843", fontFamily: "sans-serif", fontWeight: "bold", minWidth: "24px", marginTop: "1px" }}>0{i + 1}</span>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(232,228,217,0.85)", margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          {seccion("Filosofía")}
          <blockquote style={{ borderLeft: "3px solid #d4a843", paddingLeft: "20px", margin: 0, fontSize: "15px", fontStyle: "italic", color: "rgba(232,228,217,0.75)", lineHeight: 1.8 }}>
            {perfil.creencia}
          </blockquote>
        </div>

        <div style={{ marginBottom: "32px" }}>
          {seccion("Citas de Terceros")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {perfil.citas.map((c, i) => (
              <div key={i} style={{ background: c.tipo === "favorable" ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.05)", border: `1px solid ${c.tipo === "favorable" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius: "8px", padding: "16px" }}>
                <span style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: c.tipo === "favorable" ? "#4ade80" : "#f87171", fontFamily: "sans-serif", display: "block", marginBottom: "10px" }}>
                  {c.tipo === "favorable" ? "▲ Favorable" : "▼ Crítica"}
                </span>
                <p style={{ fontSize: "13px", fontStyle: "italic", lineHeight: 1.7, color: "rgba(232,228,217,0.8)", marginBottom: "10px" }}>"{c.texto}"</p>
                <p style={{ fontSize: "11px", color: "rgba(232,228,217,0.35)" }}>— {c.autor}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          {seccion("Información Ambigua")}
          <div style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.3)", borderRadius: "8px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px", marginTop: "1px" }}>⚠</span>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(232,228,217,0.8)", margin: 0 }}>{perfil.ambiguo}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "rgba(232,228,217,0.3)", fontFamily: "sans-serif" }}>
            {leidos.length} de {perfiles.length} perfiles leídos
          </p>
          <button onClick={handleComenzar} style={{ padding: "12px 32px", fontSize: "14px", background: todosLeidos ? "rgba(212,168,67,0.15)" : "transparent", border: `1px solid ${todosLeidos ? "#d4a843" : "rgba(212,168,67,0.4)"}`, color: todosLeidos ? "#d4a843" : "rgba(212,168,67,0.6)", cursor: "pointer", borderRadius: "6px", letterSpacing: "1px", fontFamily: "'Georgia', serif", transition: "all .2s" }}>
            {todosLeidos ? "Comenzar Juicio →" : "Siguiente perfil →"}
          </button>
        </div>
      </div>

      {/* Columna imagen */}
      <div style={{ width: "30%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        {perfil.imagen ? (
          <img src={perfil.imagen} alt={perfil.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)" }}>
            <span style={{ fontSize: "80px", color: "rgba(212,168,67,0.1)", fontFamily: "sans-serif", fontWeight: "bold" }}>{iniciales(perfil.nombre)}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,20,0.3) 0%, transparent 30%)" }} />
      </div>

    </main>
  )
}
