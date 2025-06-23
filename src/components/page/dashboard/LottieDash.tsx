'use client'
import dynamic from "next/dynamic";
import DashFile from "@/assets/lottie/dashboard.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function DashboardLottie() {
  return (
    <div>
      <Lottie
        animationData={DashFile}
        loop={true}
        className="w-96 h-96 mx-auto [@media(max-width:700px)]:w-52 [@media(max-width:700px)]:h-52"
      />
    </div>
  );
}
