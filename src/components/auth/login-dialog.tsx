import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthDivider } from "@/components/auth/auth-divider";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SsoNote } from "@/components/auth/sso-note";
import { LovableLogo } from "@/components/brand/lovable-logo";
import { Button } from "@/components/ui/button";

type LoginDialogProps = {
  onClose: () => void;
};

export function LoginDialog({ onClose }: LoginDialogProps) {
  const router = useRouter();

  return (
    <div className="login-overlay">
      <section className="login-modal" aria-label="Log in dialog">
        <button className="login-modal__close" type="button" aria-label="Close login" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
        <LovableLogo />
        <div>
          <p className="text-xl font-bold text-neutral-400">Start building.</p>
          <h2 className="text-xl font-bold text-neutral-950">Log in to your account</h2>
        </div>
        <SocialButtons />
        <AuthDivider />
        <Button variant="dark" className="h-9 w-full text-sm" onClick={() => router.push("/login")}>
          Continue with email
        </Button>
        <SsoNote />
      </section>
    </div>
  );
}
