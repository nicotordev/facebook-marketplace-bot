import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function LoadingScreen({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center gap-4 bg-background",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <Spinner className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
