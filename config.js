// RAGNAR FIGHTER: datos que faltan por confirmar antes de publicar.
// Deja un valor vacío ("") y la página muestra [DATO POR CONFIRMAR] en su lugar.
// Cuando lo llenes, el hueco desaparece solo. Número entre paréntesis = punto de la
// lista "Datos por completar" del documento de contenido web (página 16).
window.RAGNAR_CONFIG = {
  // (1) WhatsApp oficial: solo dígitos con indicativo de país. Ej. Colombia: "573001234567"
  whatsapp: "",

  // (2) Correo de negocios. Ej. "contacto@ragnarfighter.com"
  email: "",

  // (3) Hora exacta de las clases de martes y jueves. Ej. "6:00 p. m. a 7:30 p. m."
  classTime: "",

  // (4) Precios de clases (mensualidad y clase suelta). Ej. "Mensualidad $120.000 · Clase suelta $30.000"
  classPrice: "",

  // (5) Respuesta sobre clases personalizadas (formato y precio). Vacío = pendiente.
  privateClasses: "",

  // (6) Tarifas y disponibilidad de MC / cobertura fuera de Bogotá. Vacío = pendiente.
  eventRates: "",

  // (8) Enlaces exactos a cada video de la serie (verificados contra los títulos de YouTube
  // el 2026-10-23). Las cuatro tarjetas ya traen su portada local; un capítulo nuevo sin
  // portada local muestra sola la miniatura de YouTube. Acepta youtube.com/watch?v=...,
  // youtu.be/... o /shorts/...
  videos: {
    trailer: "https://www.youtube.com/watch?v=9M2311eRQzU",
    c1: "https://www.youtube.com/watch?v=cJMGka5hzcY",
    c2: "https://www.youtube.com/watch?v=NCcA6L5bHes",
    c3: "https://www.youtube.com/watch?v=aTmzjIlKk_0"
  },

  // (9) Enlace final del media kit en PDF
  mediaKitUrl: "",

  // Formularios. Pega aquí la URL de envío del servicio que se elija (Formspree, Getform,
  // Basin, etc.). El formulario envía JSON por POST. Sin URL, el formulario avisa que
  // todavía no está conectado y NO simula un envío.
  formEndpoint: "",
  // Lista de espera del Método Bushido. Si va vacío, usa formEndpoint.
  waitlistEndpoint: "",

  // Cifras con fecha para la sección "Para marcas". Actualizar antes de cada envío a
  // marcas y cambiar siempre el mes. Nunca redondear hacia arriba.
  stats: {
    month: "octubre de 2026",
    instagram: "5.6 K",
    tiktok: "6.7 K",
    tiktokLikes: "128.5 K"
  },

  // Titular del hero: "principal" (recomendado), "a" (más guerrera) o "b" (más personal)
  hero: "principal"

  // Fuera de este archivo:
  // (7) dominio: ver README. (10) récord de peleas: no se publica sin OK escrito de Iván.
  // (11) precio y fecha del Método Bushido: hoy solo lista de espera, no se muestra precio.
  // (12) fotos reales: ver comentarios <!-- FOTO --> en index.html. (13) año del ©: automático.
};
