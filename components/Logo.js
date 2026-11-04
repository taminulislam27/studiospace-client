import Link from "next/link";
import { LuAperture } from "react-icons/lu";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5"
      aria-label="StudioSpace home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
        <LuAperture className="h-6 w-6" strokeWidth={2.2} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        Studio<span className="text-secondary dark:text-primary">Space</span>
      </span>
    </Link>
  );
}
