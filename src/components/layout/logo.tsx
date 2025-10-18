import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image 
      src="/logo.png"
      alt="HealthSphere Logo"
      width={160}
      height={40}
      className={cn("h-auto", className)}
      priority
    />
  );
}
