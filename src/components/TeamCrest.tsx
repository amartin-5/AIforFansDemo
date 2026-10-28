import styled from 'styled-components';
import englandCrest from '../assets/crests/england.png';
import spainCrest from '../assets/crests/spain.png';

const CRESTS = {
  Spain: spainCrest,
  England: englandCrest,
} as const;

type TeamCrestProps = {
  team: keyof typeof CRESTS;
  size?: number;
  className?: string;
};

/** Official team crest for match lockups (Spain / England). */
export function TeamCrest({ team, size = 48, className }: TeamCrestProps) {
  return (
    <Crest
      className={className}
      src={CRESTS[team]}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}

const Crest = styled.img`
  display: block;
  flex-shrink: 0;
  object-fit: contain;
`;
