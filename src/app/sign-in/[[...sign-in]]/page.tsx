import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#BBFF45] hover:bg-[#A8E63C] text-black",
            card: "bg-[#121212] border-[#1E1E1E]",
          },
        }}
      />
    </div>
  );
}
