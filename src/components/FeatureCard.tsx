import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  color,
  href,
}: FeatureCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
        <div className={`${color} inline-block p-3 rounded-full mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    </Link>
  );
}
