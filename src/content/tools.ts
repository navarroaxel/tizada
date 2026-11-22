export const tools = [
  { name: "Adobe Illustrator", use: "Geometrales, fichas técnicas, rapport, moldes simples 1:1", level: "Principiante", free: "Inkscape" },
  { name: "Adobe Photoshop", use: "Color, texturas, figurines, render", level: "Principiante", free: "Krita, GIMP o Photopea" },
  { name: "Seamly2D", use: "Patronaje paramétrico, despiece, graduación, tizada, DXF-AAMA y PDF", level: "Intermedio", free: "Ya es open source" },
  { name: "CLO 3D", use: "Coser moldes sobre un avatar y simular la tela", level: "Intermedio", free: "Blender con simulación de tela (más limitado)" },
] as const;

export const physicalMaterials = [
  "Cinta métrica",
  "Regla de 50 cm y escuadra",
  "Papel madera para validar el primer molde",
  "Impresora A4 para imprimir en mosaico",
  "Celular para fotografiar moldes en papel",
];

export const setupChecklist = [
  "Configurar todos los documentos en centímetros",
  "Imprimir un cuadrado de control de 10 × 10 cm y medirlo",
  "Crear una carpeta por semana para los entregables",
  "Inicializar un repo Git para los archivos de Seamly2D",
];
