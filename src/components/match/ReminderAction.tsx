import { Button } from '@cake-admin/cakeand';
import { Bell } from 'lucide-react';

type ReminderActionProps = {
  active?: boolean;
  onToggle?: () => void;
};

export function ReminderAction({ active, onToggle }: ReminderActionProps) {
  return (
    <Button
      intent="secondary"
      variant={active ? 'tonal' : 'outline'}
      fullWidth
      startIcon={<Bell size={16} />}
      onClick={onToggle}
      aria-pressed={active}
    >
      {active ? 'Reminder set' : 'Set kick-off reminder'}
    </Button>
  );
}
