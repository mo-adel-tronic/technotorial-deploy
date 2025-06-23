import About from "@/components/page/home/About";
import Hero from "@/components/page/home/Hero";
import Navbar from "@/components/page/home/Navbar";
import TeamWork from "@/components/page/home/Team";
import { authOptions } from "@/features/auth/AuthOptions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import LoadingPage from "../loading";

export default async function Home() {
  const session = await getServerSession(authOptions)
  const authed : boolean = session?.accessToken && session.user.jobs
  return (
    <main>
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
