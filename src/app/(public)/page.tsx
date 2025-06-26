import About from "@/components/page/home/About";
import Hero from "@/components/page/home/Hero";
import Navbar from "@/components/page/home/Navbar";
import TeamWork from "@/components/page/home/Team";
import { authOptions } from "@/features/auth/AuthOptions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import LoadingPage from "../loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechnoTorial - منصة إدارة الدراسات العليا بقسم تكنولوجيا التعليم",
  description: "منصة تكنو توريال لإدارة بيانات الدراسات العليا، تدعم الباحثين والمعلمين وتوفر لهم المعلومات والأدوات اللازمة لتسهيل العمليات الأكاديمية بقسم تكنولوجيا التعليم، كلية التربية النوعية، جامعة عين شمس.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Techno Torial",
  "url": "https://technotorial.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://technotorial.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions)
  const authed : boolean = session?.accessToken && session.user.jobs
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<LoadingPage />}>
      <Navbar authUser={authed} />
      </Suspense>
      <Hero />
      <About />
      {/* <Instructions /> */}
      <TeamWork />
    </main>
  );
}
