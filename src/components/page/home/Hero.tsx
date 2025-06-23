'use client';
import dynamic from 'next/dynamic';
import HeroFile from "@/assets/lottie/hero.json";
import Link from 'next/link';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
const pageData = {
    title: "مرحبًا بك في ",
    titleSpan: "Techno Torial",
    describtion: "نحن سعداء بانضمامك إلينا! ابدأ الآن واستمتع برحلتك معنا. وإذا احتجت إلى أي مساعدة، فإن فريقنا جاهز دائمًا لدعمك."
}

export default function Hero() {
  return (
    <header id="HEADER" className="min-h-[calc(80svh-180px)] bg-app-primary scroll-mt-16 pb-12 flex lg-content-padding items-center justify-between max-[700px]:flex-col max-[700px]:justify-center max-[700px]:h-auto">
        <div className="grow text-center w-1/2 max-[700px]:w-full max-[700px]:grow-0">
            <h1 className="text-white text-4xl leading-16">{pageData.title} <br /><span className="text-app-secondary-on-primary uppercase">{pageData.titleSpan}</span></h1>
            <p className="text-white leading-9 mb-3 font-bold text-xl">
                {pageData.describtion}
            </p>
            <Link
        href="#"
        className="bg-white hover:bg-app-secondary text-app-foreground hover:text-app-secondary-foreground transition-colors duration-300 py-2 px-3 rounded-md [@media(min-width:700px)]:hidden"
      >
        تسجيل الدخول
      </Link>
        </div>
        <div className="grow w-1/2 [@media(max-width:700px)]:w-full [@media(max-width:700px)]:grow-0">
        <Lottie
          animationData={HeroFile}
          loop={true}
          className="w-96 h-96 mx-auto [@media(max-width:700px)]:w-52 [@media(max-width:700px)]:h-52"
        />
        </div>
    </header>
  )
}
