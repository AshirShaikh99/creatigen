"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignUp } from "@clerk/nextjs";

interface SignUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpDialog({ isOpen, onClose }: SignUpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#121212] border border-[#1E1E1E] p-0 overflow-hidden rounded-xl shadow-2xl">
        <DialogTitle className="sr-only">Sign Up</DialogTitle>
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="rounded-full p-1 bg-[#1E1E1E] text-gray-400 hover:text-white transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <SignUp
          routing="hash"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-6",
              headerTitle: "text-[#A78BFA] font-bold",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-[#1A1A1A] border-[#2A2A2A] text-white hover:bg-[#222222]",
              formButtonPrimary:
                "bg-gradient-to-r from-[#6366F1] to-[#A78BFA] text-white hover:opacity-90",
              footerActionLink: "text-[#A78BFA] hover:text-[#6366F1]",
              formFieldInput: "bg-[#1A1A1A] border-[#2A2A2A] text-white",
              formFieldLabel: "text-gray-400",
              formFieldLabelRow: "text-gray-400",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-[#A78BFA] hover:text-[#6366F1]",
              formResendCodeLink: "text-[#A78BFA] hover:text-[#6366F1]",
              otpCodeFieldInput: "bg-[#1A1A1A] border-[#2A2A2A] text-white",
              footer: "bg-[#121212] border-t border-[#1E1E1E] text-gray-400",
              footerText: "text-gray-400",
              footerActionText: "text-gray-400",
              footerActionLink: "text-[#A78BFA] hover:text-[#6366F1]",
              main: "bg-[#121212]",
              logoBox: "hidden",
              dividerLine: "bg-[#1E1E1E]",
              dividerText: "text-gray-500",
              alternativeMethods: "hidden",
              alert: "bg-[#1A1A1A] border-[#2A2A2A] text-gray-400",
              alertText: "text-gray-400",
              profileSectionTitle: "text-gray-400",
              profileSection: "bg-[#121212] border-[#1E1E1E]",
              formFieldAction: "text-[#A78BFA] hover:text-[#6366F1]",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              showOptionalFields: false,
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
