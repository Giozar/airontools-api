// src/utils/levenshtein.ts

/**
 * Calcula la distancia de Levenshtein entre dos cadenas.
 * @param a - Primera cadena.
 * @param b - Segunda cadena.
 * @returns Distancia de Levenshtein.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  const aLen = a.length;
  const bLen = b.length;

  // Si una de las cadenas está vacía, la distancia es la longitud de la otra cadena
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  // Inicializar la primera fila y columna de la matriz
  for (let i = 0; i <= bLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLen; j++) {
    matrix[0][j] = j;
  }

  // Rellenar la matriz
  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Eliminación
          matrix[i][j - 1] + 1, // Inserción
          matrix[i - 1][j - 1] + 1, // Sustitución
        );
      }
    }
  }

  return matrix[bLen][aLen];
}
