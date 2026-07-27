import Intro from "@/components/Intro";
import AboutThisGuy from "@/components/AboutThisGuy";
import WorkSection from "@/components/WorkSection";
import ShadowsSection from "@/components/ShadowsSection";
import HolyCurseSection from "@/components/HolyCurseSection";
import BlackWarrantSection from "@/components/BlackWarrantSection";
import KohrraSection from "@/components/KohrraSection";

export default function Home() {
  return (
    <main>
      <Intro />
      <AboutThisGuy />
      <WorkSection />
      <ShadowsSection />
      <HolyCurseSection />
      <BlackWarrantSection />
      <KohrraSection />
    </main>
  );
}
