import { Check, Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDivider } from "@/components/auth/auth-divider";
import { SocialButtons } from "@/components/auth/social-buttons";
import { LovableLogo } from "@/components/brand/lovable-logo";
import { AuthPreview } from "@/components/common/auth-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/store/flow-store";

export function EmailScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailEditable, setEmailEditable] = useState(false);
  const email = useFlowStore((state) => state.email);
  const setEmail = useFlowStore((state) => state.setEmail);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailReadOnly = Boolean(email) && !emailEditable;

  function handleCreateAccount() {
    // Email and password validation intentionally disabled.

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  function handleEditEmail() {
    setEmailEditable(true);
    window.setTimeout(() => emailInputRef.current?.focus(), 0);
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="auth-card">
          <LovableLogo />
          <h1 className="text-xl font-bold text-neutral-950">Create your account</h1>
          <SocialButtons />
          <AuthDivider />
          <label className="space-y-2 text-sm font-bold text-neutral-950">
            <span>Email</span>
            <div className="relative">
              <Input
                ref={emailInputRef}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pr-16"
                placeholder="Email"
                readOnly={emailReadOnly}
              />
              {email ? (
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs underline" type="button" onClick={handleEditEmail}>
                  Edit
                </button>
              ) : null}
            </div>
          </label>
          <label className="space-y-2 text-sm font-bold text-neutral-950">
            <span>Password</span>
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="pr-12"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700"
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                onClick={() => setPasswordVisible((current) => !current)}
              >
                {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <div className="text-sm font-semibold text-neutral-600">
            <p>Password must contain:</p>
            <ul className="mt-1 list-disc pl-5 font-normal">
              <li>at least 8 characters</li>
              <li>a number (0-9)</li>
            </ul>
          </div>
          <div className="cloudflare-box">
            <span className="cloudflare-success">
              <Check className="h-6 w-6" />
            </span>
            <span>Success!</span>
            <strong>
              <span className="cloudflare-cloud" />
              CLOUDFLARE
              <small>Privacy - Help</small>
            </strong>
          </div>
          <Button variant="dark" className="h-9 w-full text-sm" onClick={handleCreateAccount}>
            Create your account
          </Button>
          <p className="text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Log in
            </Link>
          </p>
          <p className="mx-auto max-w-[330px] text-center text-xs leading-5 text-neutral-600">
            By continuing, you agree to the <u>Terms of Service</u> and <u>Privacy Policy</u>.
          </p>
        </div>
      </section>
      <AuthPreview text="Ask Lovable to build dashboards." />
    </main>
  );
}
