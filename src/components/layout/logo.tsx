import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      className={cn("h-auto", className)}
      aria-label="HealthSphere Logo"
    >
      <path
        d="M0 20 H30 L40 10 L50 30 L60 20 H70"
        stroke="#D32F2F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="75"
        y="25"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="#000000"
      >
        HealthSphere
      </text>
    </svg>
  );
}
