import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M21.8 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.5a4.7 4.7 0 0 1-2.04 3.08v2.55h3.3c1.93-1.78 3.04-4.4 3.04-7.54Z" />
      <path fill="#34A853" d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.55c-.92.61-2.09.98-3.47.98-2.66 0-4.91-1.79-5.72-4.2H2.9v2.63A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.28 13.76a6 6 0 0 1 0-3.52V7.61H2.9a10 10 0 0 0 0 8.78l3.38-2.63Z" />
      <path fill="#EA4335" d="M12 6.04c1.5 0 2.86.52 3.92 1.53l2.93-2.93A9.84 9.84 0 0 0 12 2 10 10 0 0 0 2.9 7.61l3.38 2.63c.81-2.41 3.06-4.2 5.72-4.2Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#24292F"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.18-3.36-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.21-.25-4.54-1.11-4.54-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .85-.27 2.76 1.03A9.6 9.6 0 0 1 12 7.02c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.67-4.56 4.92.36.31.68.92.68 1.85v2.59c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#111111"
        d="M16.52 12.74c-.03-2.25 1.84-3.33 1.93-3.39-1.05-1.53-2.68-1.74-3.25-1.76-1.38-.14-2.69.81-3.39.81-.7 0-1.78-.79-2.93-.77-1.51.02-2.9.88-3.68 2.23-1.57 2.72-.4 6.75 1.13 8.96.75 1.08 1.64 2.3 2.81 2.25 1.13-.05 1.56-.73 2.92-.73 1.37 0 1.75.73 2.94.71 1.22-.02 1.99-1.1 2.73-2.19.86-1.25 1.21-2.47 1.23-2.53-.03-.01-2.37-.91-2.44-3.59ZM14.3 6.14c.62-.75 1.04-1.8.92-2.84-.89.04-1.97.6-2.61 1.35-.57.66-1.07 1.73-.94 2.75.99.08 2-.5 2.63-1.26Z"
      />
    </svg>
  );
}

export function SocialButtons() {
  return (
    <div className="space-y-5">
      <Button variant="outline" className="relative h-9 w-full border-blue-600 bg-white text-sm font-normal text-black shadow-none">
        <GoogleIcon />
        Continue with Google
        <span className="absolute -right-3 -top-3 rounded-lg border border-blue-600 bg-blue-50 px-2 py-1 text-sm text-blue-800">
          Last used
        </span>
      </Button>
      <Button variant="outline" className="h-9 w-full bg-white text-sm font-normal text-black shadow-none">
        <GitHubIcon />
        Continue with GitHub
      </Button>
      <Button variant="outline" className="h-9 w-full bg-white text-sm font-normal text-black shadow-none">
        <AppleIcon />
        Continue with Apple
      </Button>
    </div>
  );
}
