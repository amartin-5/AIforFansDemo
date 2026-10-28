import styled from 'styled-components';

/** Blue gradient app mark with Cake& radius (squircle corners). */
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
  border-radius: 28%;
  overflow: hidden;
  /* Figma: indigo/50 → blue/60 → blue/70 mapped to cake& badge blues */
  background-image: linear-gradient(
    -45deg,
    var(--color-badge-text-icon-on-indigo-light) 23%,
    var(--color-badge-blue) 50%,
    #75adfd 77%
  );
`;
