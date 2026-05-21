import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { LovableLogo } from "@/components/brand/lovable-logo";
import { PromptBox } from "@/components/common/prompt-box";
import { LoginDialog } from "@/components/auth/login-dialog";
import { Button } from "@/components/ui/button";

export function LandingScreen() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <main className="hero-surface min-h-screen">
      <nav className="mx-auto flex h-16 max-w-[1664px] items-center justify-between px-5 sm:px-8">
        <LovableLogo withText />
        <div className="hidden items-center gap-6 text-sm font-medium text-neutral-900 lg:flex">
          <button className="flex items-center gap-1" type="button">
            Solutions <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1" type="button">
            Resources <ChevronDown className="h-4 w-4" />
          </button>
          <span>Community</span>
          <span>Enterprise</span>
          <span>Pricing</span>
          <span>Security</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 border-slate-400/60 bg-white/20 text-sm" onClick={() => setLoginOpen(true)}>
            Log in
          </Button>
          <Button variant="dark" className="h-9 text-sm" onClick={() => setLoginOpen(true)}>
            Get started
          </Button>
        </div>
      </nav>
      <section className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-12 pt-28 text-center sm:pt-32">
        <button className="hero-pill" type="button">
          <span>New</span>
          Better SEO - Apps built to be found
          <span aria-hidden>-&gt;</span>
        </button>
        <h1 className="mt-7 text-3xl font-black tracking-normal text-neutral-950 sm:text-4xl">Build something Lovable</h1>
        <p className="mt-3 text-sm font-medium text-slate-700/80">Create apps and websites by chatting with AI</p>
        <PromptBox className="mt-12" onSubmit={() => setLoginOpen(true)} />
      </section>
      {loginOpen ? <LoginDialog onClose={() => setLoginOpen(false)} /> : null}
    </main>
  );
}
