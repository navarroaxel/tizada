export const site = {
  name: "tizada",
  title: "Patronaje y digitalización de indumentaria",
  description:
    "Curso autodidacta para diseñar moldes y prendas en digital: del geometral al patrón paramétrico y la simulación 3D.",
  heroLead:
    "Dibujá la prenda, construí el molde y probalo en 3D. Tres niveles, 34 semanas, todo con material gratuito.",
  levels: {
    principiante: {
      title: "Principiante",
      summary:
        "Sigue el temario de la UTN (geometral, ficha técnica, rapport y figurín) y suma el primer molde digital a escala real.",
      outcome: "Remera completa: geometral, ficha técnica, molde 1:1, estampado y figurín.",
      passCriteria:
        "Tu molde digital impreso coincide con el de papel con menos de 2 mm de diferencia, y la ficha técnica alcanzaría para que otra persona confeccione la prenda.",
    },
    intermedio: {
      title: "Intermedio",
      summary:
        "Pasás de dibujar moldes a programarlos: cada punto se define con fórmulas sobre las medidas, así un cambio de talle regenera el molde entero.",
      outcome: "Tres prendas con molde paramétrico, graduadas S–XL y probadas en 3D.",
      passCriteria: "La camisa simulada no muestra tensiones fuera de rango después de dos iteraciones de ajuste.",
    },
    avanzado: {
      title: "Avanzado",
      summary:
        "Llevás lo paramétrico a la prenda de abrigo: campera con forro, tejidos elásticos, graduación y tizada reales, simulación avanzada, ficha técnica y costeo.",
      outcome: "Colección cápsula de tres prendas, con campera forrada, lista para producir y presentar.",
      passCriteria:
        "Tu campera graduada S–XL tiene molde, forro, tizada, ficha técnica y costo, y la simulación 3D no muestra tensiones fuera de rango.",
    },
  },
  studyTips: [
    "Dos sesiones de 2 h para teoría y práctica, y 1 h semanal para cerrar el entregable.",
    "Cada molde nuevo se imprime en mosaico y se compara con el papel, o se simula en CLO 3D, antes de usarlo como base de otro.",
    "Activá la prueba de CLO 3D recién en la semana 10 del intermedio para aprovechar los 30 días.",
  ],
} as const;

export const nav = [
  { href: "/principiante", label: "Principiante" },
  { href: "/intermedio", label: "Intermedio" },
  { href: "/recursos", label: "Recursos" },
  { href: "/prendas", label: "Prendas" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/glosario", label: "Glosario" },
] as const;

export const copy = {
  footer: "Contenido de estudio personal, sin afiliación con la UTN. El temario del nivel principiante toma como referencia el curso de la UTN BA.",
  skipLink: "Saltar al contenido",
  notFoundTitle: "No encontramos esa página",
  notFoundText: "Puede que la semana o el nivel no existan.",
  notFoundCta: "Volver al inicio",
  about: "Acerca de",
} as const;

export const pages = {
  home: {
    what: "Qué vas a hacer",
    whatText:
      "Cada semana tiene temas, una práctica, un entregable y material gratuito seleccionado. Marcá las semanas que terminás y tu avance queda guardado en este navegador.",
    levels: "Elegí tu nivel",
    open: "Abrir nivel",
    progress: "Tu avance",
    startCta: "Empezar por el nivel principiante",
    planCta: "Ver el plan completo",
    heroAria: "Molde del delantero de una remera sobre una base de corte",
  },
  level: {
    modules: "Módulos",
    outcome: "Al terminar tenés",
    pass: "Cómo saber que estás listo",
    tips: "Cómo estudiar",
    deliverable: "Entregable",
  },
  week: {
    topics: "Temas",
    practice: "Práctica",
    deliverable: "Entregable",
    checks: "Cómo sé que lo logré",
    exampleNote: "Ejemplo ilustrativo",
    material: "Material",
    prev: "Semana anterior",
    next: "Semana siguiente",
    module: "Módulo",
    noMaterial: "Esta semana no tiene material nuevo: usá lo que armaste hasta acá.",
    youtube: "Buscar en YouTube",
    youtubeHint: "Elegí el video más reciente que use tu versión del programa.",
    done: "Semana terminada",
    markDone: "Marcar como terminada",
  },
  resources: {
    title: "Recursos",
    lead: "Todo el material del curso, filtrable por tipo y nivel.",
    kind: "Tipo",
    level: "Nivel",
    all: "Todos",
    kinds: { guia: "Guía", curso: "Curso", video: "Video", herramienta: "Herramienta", referencia: "Referencia" },
    levels: { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" },
    empty: "No hay recursos con esos filtros.",
    cost: "Costo",
    en: "En inglés",
    usedIn: "Se usa en",
    unused: "Material general",
  },
  garments: {
    title: "Prendas",
    lead: "Qué prendas podés hacer y sobre qué molde base se construye cada una.",
    cols: ["Prenda", "Nivel", "Base", "Qué suma"],
  },
  tools: {
    title: "Herramientas",
    lead: "Software, materiales físicos y una lista para dejar todo listo antes de empezar.",
    software: "Software",
    cols: ["Programa", "Para qué", "Nivel", "Alternativa gratuita"],
    materials: "Materiales físicos",
    checklist: "Lista de preparación",
  },
  glossary: {
    title: "Glosario",
    lead: "Los términos de patronaje y diseño digital que vas a encontrar en el curso, con su equivalente en inglés para buscar tutoriales.",
    english: "En inglés",
    seeAlso: "Ver",
    jump: "Ir a la letra",
  },
  about: {
    title: "Acerca de",
    why: "Por qué existe este curso",
    whyText:
      "Aprender patronaje digital suele implicar saltar entre programas, tutoriales sueltos y planes pagos. Este sitio ordena material gratuito en un recorrido de 34 semanas, con una práctica y un entregable concretos cada semana.",
    utn: "Relación con el temario de la UTN",
    utnText:
      "El nivel principiante sigue el temario del curso de Herramientas Digitales Básicas para Diseño de Indumentaria de la UTN BA (geometral, ficha técnica, rapport y figurín) y le suma la digitalización de moldes base. No hace falta cursarlo y este sitio no tiene afiliación con la universidad.",
    sources: "Fuentes",
    sourcesText: "Todos los recursos enlazados están listados en la sección de recursos.",
  },
} as const;
