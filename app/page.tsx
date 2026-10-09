import type { Metadata } from "next"
import { Suspense } from "react"
import { connection } from "next/server"
import Navbar from "@/components/ui/navbar"
import HeroSection from "@/components/homepage/heroSection"
import ContentSlider from "@/components/homepage/contentSlider"
import FilosofiSection from "@/components/homepage/filosofiSection"
import TaksonomiSection from "@/components/homepage/taksonomiSection"
import MetricsSection from "@/components/homepage/metricSection"
import CtaSection from "@/components/homepage/ctaSection"
import Footer from "@/components/ui/footer"
import { auth } from "@/lib/auth"
import { APP_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    alternates: { canonical: "/" },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: APP_NAME,
            description:
                "Alat manajemen aset kode pribadi untuk developer: snippet, Markdown, dan prompt AI.",
            inLanguage: "id",
            publisher: { "@id": `${SITE_URL}/#organization` },
        },
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: APP_NAME,
            url: `${SITE_URL}/`,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/icon-512.png`,
                width: 512,
                height: 512,
            },
        },
        {
            "@type": "SoftwareApplication",
            "@id": `${SITE_URL}/#software`,
            name: APP_NAME,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            url: `${SITE_URL}/`,
            description:
                "Simpan, organisir, dan temukan kembali potongan kode, file Markdown, dan prompt AI yang dapat digunakan ulang, dengan tagging, pencarian, dan keterkaitan antar aset.",
            inLanguage: "id",
            author: { "@id": `${SITE_URL}/#organization` },
            featureList: [
                "Penyimpanan snippet kode dengan syntax highlighting",
                "Penyimpanan dan pengelolaan file Markdown",
                "Perpustakaan prompt AI yang dapat dipakai ulang",
                "Tagging, pencarian, dan filter cepat",
            ],
        },
    ],
}

export const instant = false

async function NavbarWithSession() {
    await connection()
    const session = await auth()
    return <Navbar isLoggedIn={!!session} />
}

export default function Main() {
    return (
        <div className="px-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="border-x border-gray-300">
                <Suspense fallback={<Navbar isLoggedIn={false} />}>
                    <NavbarWithSession />
                </Suspense>
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