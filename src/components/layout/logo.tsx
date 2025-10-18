import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center size-8 bg-primary rounded-full", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </div>
  );
}
