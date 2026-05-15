/** Unikalna nazwa dla View Transitions API - ta sama na karcie karuzeli i na PDP */
export function productHeroViewTransitionName(slug: string): string {
  return `af-product-hero-${slug}`;
}

/** Nawigacja wewnątrz dokument.startViewTransition - Chrome 124+, fallback bez animacji */
export function navigateWithViewTransition(cb: () => void): void {
  if (typeof document === "undefined") {
    cb();
    return;
  }
  const doc = document as Document & {
    startViewTransition?: (fn: () => void) => unknown;
  };
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(cb);
    return;
  }
  cb();
}
