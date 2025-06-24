"use client";
import { Button } from "@/components/ui/button";
import { useRevalidate } from "@/hooks/revalidate";
import { signOut } from "next-auth/react";

export default function SignoutBtn() {
  const { revalidate } = useRevalidate();
  return (
    <Button onClick={async () => {
        await revalidate("/", "*");
        signOut({redirect: false})
    }} className="bg-white hover:bg-red-500 text-gray-800 hover:text-white font-bold border border-gray-300 flex items-center justify-center gap-3 relative overflow-hidden group">
      تسجيل خروج
    </Button>
  );
}
