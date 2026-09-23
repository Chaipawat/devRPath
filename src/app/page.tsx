import { getBookSections } from "@/lib/content";
import { HomeExperience } from "@/components/HomeExperience";

export default function Home() {
  const sections = getBookSections();
  return <HomeExperience sections={sections} />;
}
