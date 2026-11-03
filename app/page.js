import HeroSlider from "@/components/HeroSlider";
import CategoryCards from "@/components/CategoryCards";
import FeaturedStudios from "@/components/FeaturedStudios";
import HowBookingWorks from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <CategoryCards />
      <FeaturedStudios />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}
