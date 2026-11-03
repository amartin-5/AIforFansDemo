import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import type { ViewingProvider } from '../../types/domain';
import { ProviderMark } from './ProviderMark';

type StreamProviderPickerProps = {
  providers: ViewingProvider[];
  value?: string;
  onChange: (providerId: string) => void;
};

/**
 * Low-key preferred-stream control — logos only, no full service names in the UI.
 */
export function StreamProviderPicker({
  providers,
  value,
  onChange,
}: StreamProviderPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected =
    providers.find((p) => p.id === value) ?? providers[0] ?? null;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!selected) return null;

  return (
    <Root ref={rootRef}>
      <Trigger
        type="button"
        aria-label={`Preferred streaming service: ${selected.name}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <ProviderMark provider={selected} size={28} />
        <ChevronDown size={14} aria-hidden />
      </Trigger>

      {open ? (
        <Menu id={listId} role="listbox" aria-label="Preferred streaming service">
          {providers.map((p) => {
            const isSelected = p.id === selected.id;
            return (
              <Option
                key={p.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-label={p.name}
                $selected={isSelected}
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                }}
              >
                <ProviderMark provider={p} size={28} />
              </Option>
            );
          })}
        </Menu>
      ) : null}
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  min-height: 36px;
  padding: var(--space-050);
  border: 1px solid var(--color-stroke-border);
  border-radius: var(--radius-150);
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-secondary);
  cursor: pointer;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 2px;
  }
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + var(--space-050));
  right: 0;
  z-index: 6;
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  padding: var(--space-100);
  border-radius: var(--radius-200);
  border: 1px solid var(--color-stroke-border);
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: var(--elevation-3);
`;

const Option = styled.button<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-050);
  border: none;
  border-radius: var(--radius-150);
  background: ${(p) =>
    p.$selected ? 'var(--color-surfaces-primary)' : 'transparent'};
  cursor: pointer;

  &:hover {
    background: var(--color-tonal-tonal-secondary-overlay-hover);
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: 1px;
  }
`;
