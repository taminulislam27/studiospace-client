import {
  LuCamera,
  LuClapperboard,
  LuMic,
  LuMusic,
  LuPalette,
} from "react-icons/lu";

const ICONS = {
  "Photo Studio": LuCamera,
  "Film Stage": LuClapperboard,
  "Podcast Lounge": LuMic,
  "Music Suite": LuMusic,
  "Art Workshop": LuPalette,
};

export default function CategoryIcon({ category, ...props }) {
  const Icon = ICONS[category] || LuCamera;
  return <Icon {...props} />;
}
