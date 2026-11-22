import type { Garment } from "./types";

export const garments: Garment[] = [
  { name: "Remera básica", level: "Principiante", base: "Remera", adds: "Molde 1:1, margen, piquetes, cuello en tira" },
  { name: "Musculosa", level: "Principiante", base: "Remera", adds: "Escotes y sisas con vivo" },
  { name: "Falda recta", level: "Principiante", base: "Falda", adds: "Pinzas, cintura, cierre" },
  { name: "Falda evasé o circular", level: "Principiante", base: "Falda", adds: "Cerrar pinzas para dar vuelo; cálculo de radio" },
  { name: "Buzo con capucha", level: "Intermedio", base: "Remera", adds: "Capucha, bolsillo canguro, puños y cintura de rib" },
  { name: "Jogger", level: "Intermedio", base: "Pantalón", adds: "Bolsillos al bies, cintura elastizada" },
  { name: "Camisa", level: "Intermedio", base: "Cuerpo", adds: "Cuello, pie de cuello, cartera, puño, canesú" },
  { name: "Vestido base", level: "Intermedio", base: "Cuerpo + falda", adds: "Unir bases, cortes princesa" },
  { name: "Pantalón de vestir", level: "Intermedio", base: "Pantalón", adds: "Bragueta, pretina, bolsillo ojal" },
  { name: "Campera simple", level: "Avanzado", base: "Cuerpo", adds: "Holguras de abrigo, forrería completa, entretela" },
];
