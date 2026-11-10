import { Card } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { containerBlur } from '../styles/surfaces';

/**
 * Cake Card restyled with high-transparency Hello PC glass
 * (thinned blur fill + blur(45px) + elevation/3).
 */
export const GlassCard = styled(Card)`
  && {
    ${containerBlur}
  }
`;
