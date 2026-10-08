import Navbar from "@/components/ui/navbar"
import HeroSection from "@/components/homepage/heroSection"
import ContentSlider from "@/components/homepage/contentSlider"
import FilosofiSection from "@/components/homepage/filosofiSection"
import TaksonomiSection from "@/components/homepage/taksonomiSection"
import MetricsSection from "@/components/homepage/metricSection"
import CtaSection from "@/components/homepage/ctaSection"
import Footer from "@/components/ui/footer"
import { auth } from "@/lib/auth"

export const instant = false

export default async function Main() {
    const session = await auth()

    return (
        <div className="px-20">
            <div className="border-x border-gray-300">
                <Navbar isLoggedIn={!!session} />
                <HeroSection />
                <ContentSlider />
                <FilosofiSection />
                <TaksonomiSection />
                <MetricsSection />
                <CtaSection />
                <Footer />
            </div>
        </div>
    )
}