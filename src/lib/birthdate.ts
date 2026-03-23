/** Nascimento e data da celebração (meia-noite no fuso local) — use em todo o app. */
export const RUTH_BIRTH = new Date(1998, 2, 23, 0, 0, 0, 0);
export const RUTH_CELEBRATION = new Date(2026, 2, 23, 0, 0, 0, 0);

/**
 * Calcula quantos dias completos se passaram entre duas datas (meia-noite UTC/local conforme as Date passadas).
 */
export function getDaysLived(birth: Date, until: Date): number {
  const diffMs = Math.abs(until.getTime() - birth.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Idade em anos completos na data `onDate` (ex.: aniversário de 2026).
 */
export function getAgeOnDate(birth: Date, onDate: Date): number {
  let years = onDate.getFullYear() - birth.getFullYear();
  const monthDiff = onDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && onDate.getDate() < birth.getDate())) {
    years -= 1;
  }
  return years;
}
