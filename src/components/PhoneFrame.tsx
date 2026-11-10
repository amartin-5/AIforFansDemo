import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

/** Cake / HelloPC mobile artboard — solid demo device size at 100% zoom. */
export const PHONE_FRAME_WIDTH = 393;
export const PHONE_FRAME_HEIGHT = 916;

const VIEWPORT_PAD = 24;

/**
 * Centered phone shell. On desktop viewports the device stays a fixed
 * 393×916 artboard and scales down (never up) to fit the window. On narrow
 * viewports it goes full-bleed for real-device use.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const [{ scale, desktop }, setFit] = useState({ scale: 1, desktop: true });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const desktop = w >= PHONE_FRAME_WIDTH + VIEWPORT_PAD * 2;
      if (!desktop) {
        setFit({ scale: 1, desktop: false });
        return;
      }
      const next = Math.min(
        1,
        (w - VIEWPORT_PAD * 2) / PHONE_FRAME_WIDTH,
        (h - VIEWPORT_PAD * 2) / PHONE_FRAME_HEIGHT,
      );
      setFit({ scale: next, desktop: true });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!desktop) {
    return (
      <Viewport>
        <MobileBleed>{children}</MobileBleed>
      </Viewport>
    );
  }

  return (
    <Viewport>
      <ScaleSlot
        style={{
          width: PHONE_FRAME_WIDTH * scale,
          height: PHONE_FRAME_HEIGHT * scale,
        }}
      >
        <Device
          data-phone-frame
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </Device>
      </ScaleSlot>
    </Viewport>
  );
}

const Viewport = styled.div`
  height: 100dvh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surfaces-canvas);
  box-sizing: border-box;
  overflow: hidden;
`;

/** Layout box that matches the scaled visual size (transform alone does not). */
const ScaleSlot = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Device = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${PHONE_FRAME_WIDTH}px;
  height: ${PHONE_FRAME_HEIGHT}px;
  transform-origin: top left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  /* Solid device chrome — inset screen sits inside a thicker bezel. */
  padding: var(--space-150);
  background: var(--color-surfaces-inverse-container);
  border-radius: calc(var(--radius-400) + var(--space-150));
  border: var(--stroke-100) solid var(--color-stroke-border-high);
  box-shadow: var(--elevation-5);

  & > * {
    flex: 1 1 auto;
    min-height: 0;
    border-radius: var(--radius-400);
    overflow: hidden;
    background: var(--color-secondary-secondary-press);
  }
`;

const MobileBleed = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-secondary-secondary-press);
`;
