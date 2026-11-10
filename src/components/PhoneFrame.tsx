import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

/** Cake / HelloPC mobile artboard — outer device size at 100% zoom. */
export const PHONE_FRAME_WIDTH = 393;
export const PHONE_FRAME_HEIGHT = 916;

const VIEWPORT_PAD = 32;

/**
 * Centered hardware-style phone shell. On desktop the device stays a fixed
 * 393×916 chassis and scales down (never up) to fit. On narrow viewports it
 * goes full-bleed for real-device use.
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
        <Chassis data-phone-frame style={{ transform: `scale(${scale})` }}>
          <SideButtons $side="left" aria-hidden>
            <HardwareButton $kind="silent" />
            <HardwareButton $kind="volume" />
            <HardwareButton $kind="volume" />
          </SideButtons>
          <SideButtons $side="right" aria-hidden>
            <HardwareButton $kind="power" />
          </SideButtons>

          <ScreenWell>
            <DynamicIsland aria-hidden>
              <IslandCamera />
              <IslandSpeaker />
            </DynamicIsland>
            <Screen>{children}</Screen>
          </ScreenWell>
        </Chassis>
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

/**
 * Hardware chassis — near-black body (canvas stays dark in dark.a;
 * inverse-container flips light and was the white bezel).
 */
const Chassis = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${PHONE_FRAME_WIDTH}px;
  height: ${PHONE_FRAME_HEIGHT}px;
  transform-origin: top left;
  box-sizing: border-box;
  padding: 11px;
  border-radius: calc(var(--radius-400) + var(--space-500));
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--color-text-icon-primary) 22%, transparent) 0%,
      var(--color-surfaces-on-container-low) 18%,
      var(--color-surfaces-canvas) 52%,
      var(--color-surfaces-on-container-low) 100%
    );
  border: var(--stroke-100) solid
    color-mix(in srgb, var(--color-text-icon-primary) 28%, transparent);
  box-shadow:
    var(--elevation-5),
    inset 0 1px 0 color-mix(in srgb, var(--color-text-icon-primary) 18%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--color-surfaces-canvas) 80%, transparent);
`;

const SideButtons = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 148px;
  ${(p) => (p.$side === 'left' ? 'left: -3px;' : 'right: -3px;')}
  display: flex;
  flex-direction: column;
  gap: ${(p) => (p.$side === 'left' ? 'var(--space-200)' : '0')};
  z-index: 2;
`;

const HardwareButton = styled.span<{ $kind: 'silent' | 'volume' | 'power' }>`
  display: block;
  width: 3px;
  border-radius: var(--radius-50);
  background: color-mix(
    in srgb,
    var(--color-surfaces-on-container-low) 70%,
    var(--color-text-icon-primary)
  );
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--color-text-icon-primary) 12%, transparent);

  ${(p) =>
    p.$kind === 'silent'
      ? `
    height: 28px;
    margin-bottom: var(--space-150);
  `
      : ''}

  ${(p) =>
    p.$kind === 'volume'
      ? `
    height: 52px;
  `
      : ''}

  ${(p) =>
    p.$kind === 'power'
      ? `
    height: 88px;
    margin-top: 96px;
  `
      : ''}
`;

const ScreenWell = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(var(--radius-400) + var(--space-300));
  overflow: hidden;
  background: var(--color-surfaces-canvas);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--color-text-icon-primary) 8%, transparent);
`;

const DynamicIsland = styled.div`
  position: absolute;
  top: 11px;
  left: 50%;
  z-index: 5;
  transform: translateX(-50%);
  width: 118px;
  height: 34px;
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-canvas);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-150);
  padding: 0 var(--space-200);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--color-text-icon-primary) 6%, transparent);
  pointer-events: none;
`;

const IslandCamera = styled.span`
  width: 10px;
  height: 10px;
  border-radius: var(--radius-1000);
  background: color-mix(
    in srgb,
    var(--color-surfaces-on-container) 80%,
    var(--color-info-info)
  );
  box-shadow: inset 0 0 0 1.5px
    color-mix(in srgb, var(--color-surfaces-canvas) 70%, transparent);
`;

const IslandSpeaker = styled.span`
  width: 42px;
  height: 6px;
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-on-container-low);
  opacity: 0.85;
`;

const Screen = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surfaces-canvas);
`;

const MobileBleed = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surfaces-canvas);
`;
