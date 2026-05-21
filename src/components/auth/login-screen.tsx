import { AuthDivider } from "@/components/auth/auth-divider";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SsoNote } from "@/components/auth/sso-note";
import { LovableLogo } from "@/components/brand/lovable-logo";
import { AuthPreview } from "@/components/common/auth-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFlowStore } from "@/store/flow-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginScreen() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const email = useFlowStore((state) => state.email);
  const setEmail = useFlowStore((state) => state.setEmail);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function handleContinue() {
    setSubmitted(true);

    if (!emailIsValid) {
      return;
    }

    router.push("/signup");
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="auth-card">
          <LovableLogo />
          <h1 className="text-xl font-bold text-neutral-950">Log in</h1>
          <SocialButtons />
          <AuthDivider />
          <label className="space-y-2 text-sm font-bold text-neutral-950">
            <span>Email</span>
            <Input
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={cn(submitted && !emailIsValid && "auth-input-error")}
              aria-invalid={submitted && !emailIsValid}
            />
            {submitted && !emailIsValid ? <p className="auth-field-error">Enter a valid email address.</p> : null}
          </label>
          <Button variant="dark" className="h-9 w-full text-sm" onClick={handleContinue}>
            Continue
          </Button>
          <p className="text-center text-sm text-neutral-700">
            Don&apos;t have an account?{" "}
            <Link className="font-medium underline" href="/signup">
              Create your account
            </Link>
          </p>
          <SsoNote />
        </div>
      </section>
      <AuthPreview text="Ask Lovable to build your landing page." />
    </main>
  );
}
