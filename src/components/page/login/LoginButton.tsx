"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MicrosoftLogo } from "./MicrosoftLogo";
import { signIn } from "next-auth/react";
import { RoutesName } from "@/constants/RoutesName";
import { useRevalidate } from "@/hooks/revalidate";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { revalidate } = useRevalidate();
  const router = useRouter();

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);

    // Use redirect: false for AJAX login
    const result = await signIn('azure-ad', {
      redirect: false,
      callbackUrl: RoutesName.DASHBOARD
    });

    if (result?.ok) {
      // Revalidate the dashboard (or any relevant page)
      await revalidate("/", "*");
      // Redirect manually
      router.push(RoutesName.DASHBOARD);
    }
    setIsLoading(false);
  };
  return (
    <Button
      onClick={() => handleMicrosoftLogin()}
      disabled={isLoading}
      className="w-2/5 mx-auto h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-3 relative overflow-hidden group"
    >
      <span className="absolute inset-0 w-0 bg-primary/10 transition-all duration-300 ease-out group-hover:w-full"></span>
      <MicrosoftLogo className="w-5 h-5" />
      <span className="relative font-bold">
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول باستخدام Microsoft"}
      </span>
    </Button>
  );
}
