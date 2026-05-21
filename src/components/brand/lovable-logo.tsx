import { cn } from "@/lib/utils";

type LovableLogoProps = {
  withText?: boolean;
  className?: string;
};

export function LovableLogo({ withText = false, className }: LovableLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span aria-hidden className="lovable-logo-mark" />
      {withText ? <span className="text-xl font-black tracking-normal text-neutral-950">Lovable</span> : null}
    </div>
  );
}
