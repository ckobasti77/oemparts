/** Spaja klase i preskače prazne vrednosti. Komponente drže svoje klase bez sukoba, pa
 * pozivalac prosleđuje samo klase rasporeda (margine, širina, mesto u mreži). */
export function cn(...values: Array<string | false | null | undefined | 0>): string {
  return values.filter(Boolean).join(" ");
}
