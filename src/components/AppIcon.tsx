import styled from 'styled-components';
import { appIconMask } from '../assets/template';

/** Blue gradient squircle from Figma app icon (mask + indigo→blue gradient). */
export function AppIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Icon
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

const Icon = styled.div`
  flex-shrink: 0;
  /* Figma: indigo/50 → blue/60 → blue/70. Mid/end map to cake& badge blues;
     indigo stop uses on-indigo-light (#5066ff). Third stop has no exact token. */
  background-image: linear-gradient(
    -45deg,
    var(--color-badge-text-icon-on-indigo-light) 23%,
    var(--color-badge-blue) 50%,
    #75adfd 77%
  );
  mask-image: url(${appIconMask});
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url(${appIconMask});
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
`;
