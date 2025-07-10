import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="Back to homepage">
      <Image
        src="https://i.postimg.cc/7ZygPH9q/logo.png"
        alt="Tracklytics Logo"
        width={140}
        height={40}
        priority
      />
    </Link>
  );
}
