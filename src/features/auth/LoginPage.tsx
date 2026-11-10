import { Button, TextInput } from '@cake-admin/cakeand';
import { GlassCard } from '../../components/GlassCard';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAccount } from './AccountContext';
import { AuthBack } from './AuthBack';
import { AuthBrand, PoweredByLenovo } from './AuthBrand';
import { AuthShell } from './AuthShell';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, startSignUp, skipToDemo, session } = useAccount();
  const [email, setEmail] = useState(session?.email ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const { onboarded } = signIn(email.trim(), password);
    navigate(onboarded ? '/home' : '/create-profile');
  };

  const handleSignUp = () => {
    startSignUp(email.trim() || 'fan@example.com');
    navigate('/create-profile');
  };

  const handleSkip = () => {
    skipToDemo();
    navigate('/home', { replace: true });
  };

  return (
    <AuthShell label="Sign in">
      <AuthBack to="/welcome" label="Back to welcome" />
      <AuthBrand />

      <GlassCard>
        <FormPad as="form" onSubmit={handleLogin}>
          <FormTitle>Sign in</FormTitle>

          <TextInput
            label="Username or email"
            type="email"
            autoComplete="username"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startIcon={<Mail size={18} />}
            required
          />

          <TextInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock size={18} />}
            endIcon={
              <IconToggle
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconToggle>
            }
          />

          <ForgotRow>
            <Button type="button" intent="secondary" variant="ghost" size="sm" underline>
              Forgot password?
            </Button>
          </ForgotRow>

          <Button type="submit" fullWidth size="lg" endIcon={<ArrowRight size={16} />}>
            Login
          </Button>

          <SkipLink type="button" onClick={handleSkip}>
            Skip login — enter demo
          </SkipLink>
        </FormPad>
      </GlassCard>

      <Footer>
        <SignUpRow>
          <Muted>Don’t have an account?</Muted>
          <Button type="button" intent="secondary" variant="ghost" underline onClick={handleSignUp}>
            Sign up
          </Button>
        </SignUpRow>
        <PoweredByLenovo />
      </Footer>
    </AuthShell>
  );
}

const FormPad = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-350);
  width: 100%;
  box-sizing: border-box;
`;

const FormTitle = styled.h1`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const IconToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  color: var(--color-text-icon-secondary);
  cursor: pointer;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const ForgotRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: calc(var(--space-100) * -1);
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
  width: 100%;
  align-items: center;
`;

const SignUpRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  flex-wrap: wrap;
`;

const Muted = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
`;

const SkipLink = styled.button`
  align-self: center;
  border: none;
  background: transparent;
  padding: var(--space-050) var(--space-100);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: var(--color-text-icon-primary);
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
    border-radius: var(--radius-100);
  }
`;
