import { LockKeyhole } from "lucide-react";

export function SsoNote() {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
      <LockKeyhole className="h-4 w-4" />
      <span>
        SSO available on <u>Business and Enterprise plans</u>
      </span>
    </div>
  );
}
