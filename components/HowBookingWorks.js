import { LuCalendarCheck, LuClock, LuSearch, LuSparkles } from "react-icons/lu";

const STEPS = [
  {
    icon: LuSearch,
    title: "Discover Spaces",
    text: "Filter by category, location and budget to find a room that fits your shoot.",
  },
  {
    icon: LuClock,
    title: "Select Shoot Hours",
    text: "Pick a date and your start and end time. The hourly rate and deposit are shown before you commit.",
  },
  {
    icon: LuCalendarCheck,
    title: "Book Instantly",
    text: "Send your request in one step and track its status from your bookings page.",
  },
  {
    icon: LuSparkles,
    title: "Create & Produce",
    text: "Show up, set up and make the thing. The room is yours for the hours you booked.",
  },
];

export default function HowBookingWorks() {
  return (
    <section
      id="how-it-works"
      className="page-container scroll-mt-20 py-16 sm:py-20"
      aria-labelledby="how-title"
    >
      <div className="max-w-2xl">
        <p className="section-eyebrow">How booking works</p>
        <h2 id="how-title" className="section-title mt-2">
          From idea to call time in four steps
        </h2>
      </div>

      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            className="relative flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-secondary-content">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-display text-4xl font-bold text-base-content/15">
                0{i + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-base-content/70">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
