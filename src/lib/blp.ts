// Bell-LaPadula
export function canRead(userLevel: number, objectLevel: number): boolean {
  return userLevel >= objectLevel; // No Read Up
}

export function canWrite(userLevel: number, objectLevel: number): boolean {
  return userLevel <= objectLevel; // No Write Down
}
