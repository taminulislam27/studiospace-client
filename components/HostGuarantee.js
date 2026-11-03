import { LuBadgeCheck, LuHeadset, LuShieldCheck, LuWrench } from "react-icons/lu";

const ASSURANCES = [
  {
    icon: LuShieldCheck,
    title: "Liability protection",
    text: "Clear deposit terms on every listing protect hosts and creators when something goes wrong.",
  },
  {
    icon: LuBadgeCheck,
    title: "Verified profiles",
    text: "Hosts and creators sign in with verified accounts, so you know who is booking and who is hosting.",
  },
  {
    icon: LuWrench,
    title: "Equipment safety",
    text: "Listings state what gear is on site, so nothing is a surprise when you load in.",
  },
  {
    icon: LuHeadset,
    title: "24/7 host support",
    text: "Questions before or during a session get answered by people, any hour of the day.",
  },
];

export default function HostGuarantee() {
  return (
    <section className="bg-neutral py-16 text-neutral-content sm:py-20" aria-labelledby="guarantee-title">
      <div className="page-container">
        <div className="max-w-2xl">
          <p className="section-eyebrow text-primary">Host guarantee and creator support</p>
          <h2 id="guarantee-title" className="section-title mt-2 text-neutral-content">
            Book and host with confidence
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-content/70">
            Whether you are renting a room or sharing yours, these protections
            apply to every booking on StudioSpace.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ASSURANCES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex h-full flex-col gap-4 rounded-box border border-white/10 bg-white/5 p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-content">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-neutral-content">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-content/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
