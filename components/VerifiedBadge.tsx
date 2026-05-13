import { Check } from 'lucide-react';

export function VerifiedBadge({ label = 'Verified' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-primary-light px-2.5 py-1 text-xs font-bold text-primary-dark">
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
