window.APP_CONFIG = {
  name: "Footage Archive",
  signature: "Registros Fantasmas",
  logoImage: "https://xcjzydmprmbpbqkacjwb.supabase.co/storage/v1/object/public/avatars/avatar.png",
  logoAlt: "Footage Archive",
  accessPin: "0906",
  developerPin: "0806",
  pinProfiles: {
    developer: { label: "Desarrollador", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23101114'/%3E%3Ccircle cx='100' cy='100' r='76' fill='none' stroke='%23ff9eb4' stroke-width='8'/%3E%3Ctext x='100' y='119' fill='%23fff7f3' font-family='Arial,sans-serif' font-size='54' text-anchor='middle'%3EFA%3C/text%3E%3C/svg%3E" },
    ella: { label: "Ella", image: "https://xcjzydmprmbpbqkacjwb.supabase.co/storage/v1/object/public/avatars/avatar.png" }
  },
  intro: "Un pequeño archivo de todo lo que siento.",
  lastUpdated: "2026-09-03",

  // Mensajes usados por el acceso, la portada y los estados de conexión.
  texts: {
    system: {
      randomMessages: ["Hay cosas bonitas que solo aparecen cuando vuelves.", "Este archivo guarda más de lo que parece.", "Una pausa también puede ser un recuerdo.", "Quédate un momento, aquí todo habla de ti.", "Algunas historias merecen una segunda mirada.", "Lo mejor de este lugar aparece sin avisar.", "Guarda este instante cerca del corazón.", "Hay recuerdos que saben esperar.", "Tu historia también merece un lugar bonito.", "Vuelve despacio, aquí nada tiene prisa.", "A veces una imagen dice todo.", "Este pequeño archivo sigue creciendo contigo.", "La memoria tiene su propia luz.", "Quédate con lo que te haga sonreír.", "Hay días que merecen repetirse.", "Todo lo importante cabe en un instante.", "Un detalle puede cambiar todo el día.", "Aquí viven las cosas que no queremos perder.", "La distancia no borra lo que importa.", "El tiempo también sabe cuidar.", "Una pausa, una mirada, un recuerdo.", "Lo sencillo suele quedarse más tiempo.", "Hay lugares que se sienten como casa.", "Este mensaje llegó justo cuando debía.", "Cada visita encuentra algo distinto.", "Lo bonito también puede ser cotidiano.", "Las historias más sinceras hablan bajito.", "Este rincón guarda una parte de ti.", "Que nunca falten motivos para volver.", "Algunas emociones prefieren quedarse escritas."],
      accessTitles: ["Una pequeña<br><em>clave.</em>", "Un instante<br><em>privado.</em>", "Un recuerdo<br><em>para ti.</em>", "Antes de entrar,<br><em>respira.</em>", "Una puerta<br><em>secreta.</em>", "Algo bonito<br><em>te espera.</em>", "Un rincón<br><em>de nosotros.</em>", "La memoria<br><em>continúa.</em>", "Un secreto<br><em>en pausa.</em>", "Solo tú<br><em>puedes entrar.</em>", "La noche<br><em>también recuerda.</em>", "Un lugar<br><em>hecho para ti.</em>"],
      pinMessages: ["La memoria tiene una puerta.", "Solo falta un pequeño secreto.", "Este recuerdo sabe esperarte.", "Hay algo bonito al otro lado.", "Respira, estás a punto de entrar.", "La clave guarda un momento nuestro.", "Una pequeña puerta hacia lo que sentimos.", "Lo más bonito también puede ser privado.", "Aquí empieza otra parte de nosotros.", "El archivo te estaba esperando."],
      menuMessages: ["Lo bonito de nosotros también merece quedarse."],
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
      wrongPin: "Código incorrecto. Intenta de nuevo. ❤️",
      sectionAccessTitle: "Antes de continuar,<br><em>una clave.</em>",
      sectionAccessCopy: "Cada sección guarda una pequeña sorpresa.",
      loadingFallback: "Cargando recuerdos...",
    },
    // Textos de la pantalla de acceso.
    accessCopy: "Escribe el PIN para entrar a este recuerdo.",
    pinLabel: "Introduce tu PIN",
    pinPlaceholder: "0 0 0 0",

    // Textos específicos de cada vista.
    home: {
      heroTitle: "Footage<br><em>Archive.</em>",
    },
    notes: {
      messageLabel: "Tu mensaje",
      messagePlaceholder: "Escribe algo bonito para que quede guardado.",
      greetingName: "Nohelia",
      loveTitle: "El Amor de<br><em>Mi Vida.</em>"
    }
  },
  spotifyEmbed: "https://open.spotify.com/embed/track/5Hg1m5uhSPL75ejQgPOmyc?utm_source=generator&theme=0",
  supabase: {
    url: "https://xcjzydmprmbpbqkacjwb.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjanp5ZG1wcm1icGJxa2FjandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNzY1NjEsImV4cCI6MjA4MzY1MjU2MX0.Bpr4H2iZPl5JWW8rTXp4nBiB1Z_c7pIhKXiThydeNUw",
    galleryTable: "gallery_items",
    commentsTable: "comentarios",
    commentsMessageColumn: "mensaje",
    galleryBucket: "gallery"
  },
};
document.write('<script src="content.js"></script>');
