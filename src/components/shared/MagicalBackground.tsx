/**
 * Fixed atmospheric background layers for the magical school theme.
 * Pure CSS only - a deep night sky with slowly twinkling stars, thin
 * drifting mist and a few floating candlelight particles.
 * All animations are subtle and disabled for reduced-motion users.
 */
export function MagicalBackground() {
  return (
    <>
      <div className="night-sky" aria-hidden="true" />
      <div className="candle-dust" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </>
  );
}
