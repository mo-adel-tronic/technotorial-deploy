"use client";
import { Button } from "@/components/ui/button";
import { useRevalidate } from "@/hooks/revalidate";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignoutBtn() {
  const { revalidate } = useRevalidate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await revalidate("/", "*");
        await signOut({ redirect: false });
        router.push("/login");
        setIsLoading(false);
      }}
      disabled={isLoading}
      className="bg-white hover:bg-red-500 text-gray-800 hover:text-white font-bold border border-gray-300 flex items-center justify-center gap-3 relative overflow-hidden group"
    >
      <span className="relative font-bold">
        {isLoading ? "جاري تسجيل الخروج..." : "تسجيل خروج"}
      </span>
    </Button>
  );
}
