import { IconButton } from '@cake-admin/cakeand';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type AuthBackProps = {
  to: string;
  label?: string;
};

/** Explicit previous-step control for the auth flow (welcome → login → profile). */
export function AuthBack({ to, label = 'Back' }: AuthBackProps) {
  const navigate = useNavigate();

  return (
    <Row>
      <IconButton
        label={label}
        icon={<ArrowLeft size={20} />}
        intent="secondary"
        variant="ghost"
        size="sm"
        onClick={() => navigate(to)}
      />
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin: calc(var(--space-100) * -1) 0 0 calc(var(--space-100) * -1);
`;
