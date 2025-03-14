"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignIn } from "@clerk/nextjs";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInDialog({ isOpen, onClose }: SignInDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black border border-[#C1FF00]/20">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <SignIn
          routing="hash"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "text-[#C1FF00]",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-[#111111] border-[#222222] text-white hover:bg-[#161616]",
              formButtonPrimary: "bg-[#C1FF00] text-black hover:bg-[#9BDB00]",
              footerActionLink: "text-[#C1FF00] hover:text-[#9BDB00]",
              formFieldInput: "bg-[#111111] border-[#222222] text-white",
              formFieldLabel: "text-gray-400",
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
