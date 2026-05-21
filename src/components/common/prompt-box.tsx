import { ArrowUp, ChevronDown, Mic, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PromptBoxProps = {
  compact?: boolean;
  placeholder?: string;
  onSubmit?: () => void;
  className?: string;
};

export function PromptBox({ compact = false, placeholder, onSubmit, className }: PromptBoxProps) {
  return (
    <div className={cn("prompt-box", compact && "prompt-box--compact", className)}>
      <p className="prompt-box__placeholder">{placeholder ?? "Ask Lovable to create a landing page for my..."}</p>
      <div className="prompt-box__toolbar">
        {!compact ? (
          <Button aria-label="Add attachment" size="icon" variant="outline" className="h-10 w-10 border-neutral-200 bg-white/60">
            <Plus className="h-5 w-5" />
          </Button>
        ) : null}
        <div className="ml-auto flex items-center gap-3">
          {!compact ? (
            <button className="flex items-center gap-1 text-sm text-blue-700" type="button">
              Plan <ChevronDown className="h-4 w-4" />
            </button>
          ) : null}
          {!compact ? <Mic className="h-4 w-4 text-neutral-600" /> : null}
          <Button aria-label="Send prompt" size="icon" className="h-10 w-10 bg-neutral-950 hover:bg-neutral-800" onClick={onSubmit}>
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
