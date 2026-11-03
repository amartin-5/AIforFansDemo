import styled from 'styled-components';
import australiaCrest from '../assets/crests/australia.svg';
import colombiaCrest from '../assets/crests/colombia.svg';
import costaRicaCrest from '../assets/crests/costa-rica.svg';
import englandCrest from '../assets/crests/england.png';
import japanCrest from '../assets/crests/japan.svg';
import netherlandsCrest from '../assets/crests/netherlands.png';
import spainCrest from '../assets/crests/spain.png';
import swedenCrest from '../assets/crests/sweden.svg';
import switzerlandCrest from '../assets/crests/switzerland.svg';
import zambiaCrest from '../assets/crests/zambia.svg';
import type { CrestKey } from '../types/domain';

const CRESTS: Record<CrestKey, string> = {
  Spain: spainCrest,
  England: englandCrest,
  Sweden: swedenCrest,
  Netherlands: netherlandsCrest,
  Japan: japanCrest,
  Australia: australiaCrest,
  Colombia: colombiaCrest,
  'Costa Rica': costaRicaCrest,
  Switzerland: switzerlandCrest,
  Zambia: zambiaCrest,
};

type TeamCrestProps = {
  team: CrestKey;
  size?: number;
  className?: string;
};

/** National team crest for match lockups. */
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
