
export const CATEGORIES = [
  {
    value: "Photo Studio",
    label: "Photo Studios",
    blurb: "Cyc walls, daylight rooms and seamless backdrops.",
  },
  {
    value: "Film Stage",
    label: "Sound Stages",
    blurb: "Blackout stages with grid lighting and rigging.",
  },
  {
    value: "Podcast Lounge",
    label: "Podcast Rooms",
    blurb: "Treated rooms with mics, boom arms and mixers.",
  },
  {
    value: "Music Suite",
    label: "Music Suites",
    blurb: "Recording suites with monitors, booths and backline.",
  },
  {
    value: "Art Workshop",
    label: "Art Workshops",
    blurb: "Open floors for painting, ceramics and printmaking.",
  },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/", isActive: (p) => p === "/" },
  {
    label: "Explore Studios",
    href: "/studios",
    isActive: (p) => p.startsWith("/studios"),
  },
  { label: "How It Works", href: "/#how-it-works", isActive: () => false },
  { label: "About Us", href: "/about", isActive: (p) => p.startsWith("/about") },
];

export const AMENITIES = [
  "Natural light",
  "Cyc wall",
  "Softboxes & strobes",
  "Backdrops",
  "Blackout curtains",
  "Lighting grid",
  "Green screen",
  "Soundproofing",
  "Podcast mics",
  "Mixing console",
  "Studio monitors",
  "Drum kit",
  "Wi-Fi",
  "Air conditioning",
  "Free parking",
  "Changing room",
  "Kitchenette",
  "Power backup",
];

export function categoryHref(value) {
  return `/studios?category=${encodeURIComponent(value)}`;
}
