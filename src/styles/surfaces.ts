import { css } from 'styled-components';

/**
 * Hello PC surface recipes — Special Surfaces + Elevation foundations.
 * @see https://cake.lenovo.com/storybook/?path=/docs/foundations-special-surfaces--docs
 * @see https://cake.lenovo.com/storybook/?path=/docs/foundations-elevation--docs
 *
 * Atmospheric shell: content cards use a lighter, more transparent mix of the
 * container-blur token so the backdrop reads through. blur-high stays OS-only.
 */

/**
 * High-transparency glass fill — Hello PC blur token, thinned with transparent.
 * ~32% of container-blur keeps theme (light/dark) while letting atmosphere show.
 */
export const glassFill =
  'color-mix(in srgb, var(--color-surfaces-container-blur) 32%, transparent)';

/** Slightly denser fill for sticky chrome / readable overlays. */
export const glassFillChrome =
  'color-mix(in srgb, var(--color-surfaces-container-blur) 48%, transparent)';

/**
 * Hello PC glass rim. dark.a's `--color-stroke-border-container-os` resolves to
 * rgba(0,0,0,.05) and disappears on atmospheric backgrounds — use a soft
 * primary-text edge instead (Marketing ICC white rim pattern).
 */
export const glassRim =
  'color-mix(in srgb, var(--color-text-icon-primary) 18%, transparent)';

/**
 * Special surface: container blur (modern / high-transparency).
 * Fill + blur + elevation ship together. Light rim keeps the edge readable
 * when the fill is thin (`background-clip: padding-box` per Hello PC).
 */
export const containerBlur = css`
  background: ${glassFill};
  background-clip: padding-box;
  border: var(--stroke-100) solid ${glassRim};
  backdrop-filter: blur(45px) saturate(1.45);
  -webkit-backdrop-filter: blur(45px) saturate(1.45);
  box-shadow: var(--elevation-3);
`;

/** Primary content card — glassy container blur at elevation/3. */
export const restingSurface = css`
  border-radius: var(--radius-400);
  overflow: hidden;
  ${containerBlur}
`;

/** Compact glassy tile (smaller radius, same blur recipe). */
export const restingTile = css`
  border-radius: var(--radius-300);
  overflow: hidden;
  ${containerBlur}
`;

/**
 * Nested inset inside a glass surface.
 * Same translucent fill, no elevation — depth does not compound.
 */
export const onContainerSurface = css`
  border-radius: var(--radius-200);
  background: ${glassFill};
  background-clip: padding-box;
  border: var(--stroke-100) solid ${glassRim};
  backdrop-filter: blur(45px) saturate(1.45);
  -webkit-backdrop-filter: blur(45px) saturate(1.45);
`;

/**
 * Sticky app chrome floating over page content.
 * Slightly denser than cards for contrast; never blur-high.
 */
export const stickyChrome = css`
  background: ${glassFillChrome};
  background-clip: padding-box;
  border: var(--stroke-100) solid ${glassRim};
  backdrop-filter: blur(45px) saturate(1.4);
  -webkit-backdrop-filter: blur(45px) saturate(1.4);
  box-shadow: var(--elevation-3);
`;

/** AI / insight accent — thin glass with primary wash. */
export const accentSurface = css`
  border-radius: var(--radius-400);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--color-primary-primary-overlay) 0%,
    ${glassFill} 62%
  );
  background-clip: padding-box;
  border: var(--stroke-100) solid ${glassRim};
  backdrop-filter: blur(45px) saturate(1.5);
  -webkit-backdrop-filter: blur(45px) saturate(1.5);
  box-shadow: var(--elevation-3);
`;

/**
 * Interactive lift for tappable glass tiles.
 * elevation/3 (Overlay) → elevation/4 (Prominent).
 */
export const interactiveLift = css`
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--elevation-4);
    border-color: var(--color-stroke-border-pop);
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--elevation-3);
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

/** Gentle entrance for stacked modules. */
export const fadeRiseIn = css`
  animation: cakeFadeRise 420ms ease both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes cakeFadeRise {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/** @deprecated Prefer restingSurface. */
export const glassSurface = restingSurface;
/** @deprecated Prefer restingTile. */
export const glassTile = restingTile;
/** @deprecated Prefer stickyChrome. */
export const glassChrome = stickyChrome;
/** @deprecated Prefer accentSurface. */
export const glassAccent = accentSurface;
