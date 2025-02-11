import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { MagicCard } from "@/components/magicui/magic-card";

export const PromptCard = ({ prompt }: { prompt: string }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        borderRadius: "1.2rem",
        transition: { duration: 0.2 },
      }}
    >
      <MagicCard
        className={cn(
          "relative h-full w-64 overflow-hidden rounded-xl p-4 mx-2",
          "cursor-pointer flex items-center justify-center",
          "text-sm"
        )}
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <blockquote className="text-black text-center w-full break-words whitespace-normal">
          {prompt}
        </blockquote>
      </MagicCard>
    </motion.div>
  );
};
