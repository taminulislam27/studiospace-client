import Link from "next/link";
import { LuHandshake, LuKeyRound, LuScale } from "react-icons/lu";

export const metadata = { title: "About Us" };

const VALUES = [
  {
    icon: LuKeyRound,
    title: "Idle rooms should earn",
    text: "A cyc wall that sits empty on a Tuesday is wasted. Hosts list open hours and get paid for them.",
  },
  {
    icon: LuScale,
    title: "Prices you can read",
    text: "Hourly rate, security deposit and capacity sit on every listing, before anyone sends a request.",
  },
  {
    icon: LuHandshake,
    title: "Trust on both sides",
    text: "Verified accounts and a clear booking status keep hosts and creators on the same page.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-container py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="section-eyebrow">About StudioSpace</p>
          <h1 className="section-title mt-2">
            A peer-to-peer home for creative workspace
          </h1>
          <p className="section-lead mt-4 text-lg">
            StudioSpace connects people who own creative rooms with the
            filmmakers, photographers, podcasters, musicians and artists who
            need them. Hosts list photography cyc walls, sound stages, podcast
            lounges, recording suites and workshops. Creators compare options,
            check availability and reserve slots with transparent pricing.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm leading-relaxed text-base-content/70">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/studios" className="btn btn-primary">
            Explore Studios
          </Link>
          <Link href="/add-studio" className="btn btn-outline">
            Host Your Space
          </Link>
        </div>
      </section>
    </>
  );
}
