import styled from 'styled-components';
import { accountCircleIcon, bellIcon } from '../assets/template';
import { AppIcon } from './AppIcon';

export function TopBar() {
  return (
    <Bar>
      <AppIcon size={32} />
      <Actions>
        {/* Figma placeholder profile icon — replace when final asset is provided */}
        <IconImg src={accountCircleIcon} alt="" width={20} height={20} />
        <BellWrap>
          <IconImg src={bellIcon} alt="" width={27} height={27} />
        </BellWrap>
      </Actions>
    </Bar>
  );
}

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-200) var(--space-350) 0;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-650);
`;

const IconImg = styled.img`
  display: block;
  flex-shrink: 0;
`;

const BellWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 100%;
`;
