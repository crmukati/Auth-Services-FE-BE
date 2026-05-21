import { ArrowUp } from "lucide-react";

type AuthPreviewProps = {
  text: string;
};

export function AuthPreview({ text }: AuthPreviewProps) {
  return (
    <aside className="auth-preview">
      <div className="auth-preview__prompt">
        <span>{text}</span>
        <span className="auth-preview__cursor" />
        <button aria-label="Submit preview prompt" type="button">
          <ArrowUp className="h-6 w-6" />
        </button>
      </div>
    </aside>
  );
}
