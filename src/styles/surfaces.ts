import { css } from 'styled-components';

/**
 * HelloPC / Cake& glass language — frosted surfaces over the atmospheric
 * background. Blur magnitudes mirror Lenovo Marketing ICC (Figma).
 * Prefer these over hard `--color-stroke-border` boxes.
 */

/** Soft frosted panel — primary content surface. */
export const glassSurface = css`
  border-radius: var(--radius-400);
  border: 1px solid var(--color-stroke-border-container-os);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: var(--elevation-4);
`;

/** Denser glass for chrome (top / bottom bars). */
export const glassChrome = css`
  border-color: var(--color-stroke-border-container-os);
  background: var(--color-surfaces-container-blur-high);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
`;

/** Compact tile / chip surface. */
export const glassTile = css`
  border-radius: var(--radius-300);
  border: 1px solid var(--color-stroke-border-container-os);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow: var(--elevation-2);
`;

/** AI / insight accent wash — primary overlay gradient, Cake tokens only. */
export const glassAccent = css`
  border-radius: var(--radius-400);
  border: 1px solid var(--color-stroke-border-container-os);
  background: linear-gradient(
    135deg,
    var(--color-primary-primary-overlay) 0%,
    var(--color-surfaces-container-blur) 62%
  );
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow:
    var(--elevation-4),
    inset 0 0 0 1px var(--color-primary-primary-overlay);
`;

/** Soft interactive lift for tappable glass tiles. */
export const interactiveLift = css`
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-stroke-border-high);
    box-shadow: var(--elevation-5);
  }

  &:active {
    transform: translateY(0);
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
