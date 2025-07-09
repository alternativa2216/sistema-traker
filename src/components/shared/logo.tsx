import { BarChart3 } from "lucide-react";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="Back to homepage">
      <BarChart3 className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline text-foreground">
        Tracklytics
      </span>
    </Link>
  );
}
