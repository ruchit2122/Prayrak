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
    <main>
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
