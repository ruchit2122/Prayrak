import Intro from "@/components/Intro";
import AboutThisGuy from "@/components/AboutThisGuy";
import WorkSection from "@/components/WorkSection";
import ShadowsSection from "@/components/ShadowsSection";
import HolyCurseSection from "@/components/HolyCurseSection";
import BlackWarrantSection from "@/components/BlackWarrantSection";
import KohrraSection from "@/components/KohrraSection";
import ZiddiGirlsSection from "@/components/ZiddiGirlsSection";
import SisterhoodSection from "@/components/SisterhoodSection";
import UpcomingReleasesSection from "@/components/UpcomingReleasesSection";
import CoFounder from "@/components/CoFounder";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    // `overflow-x-clip`, not `overflow-x-hidden`: a frame waiting to slide in
    // sits a full screen off the right edge, which would otherwise open a
    // horizontal scrollbar across the whole page. `hidden` would also hide it,
    // but it makes this element a scroll container, and a scroll container is
    // what `position: sticky` measures itself against — every frame would then
    // stick to this box instead of to the window and the stack would collapse.
    // `clip` cuts the overflow without becoming one.
    <main className="overflow-x-clip">
      <Intro />
      <AboutThisGuy />
      <WorkSection />
      <ShadowsSection />
      <HolyCurseSection />
      <BlackWarrantSection />
      <KohrraSection />
      <ZiddiGirlsSection />
      <SisterhoodSection />
      <UpcomingReleasesSection />
      <CoFounder />
      <ContactSection />
      <Footer />
    </main>
  );
}
