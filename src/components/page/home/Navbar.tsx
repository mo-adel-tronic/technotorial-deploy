'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import AppLogo from "@/components/shared/AppLogo";
import NavList from "./NavList";
import { RoutesName } from "@/constants/RoutesName";

export default function Navbar({authUser} : {authUser : boolean}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "flex justify-between items-center h-16 lg-content-padding sticky top-0 z-50 transition-all duration-300 max-[700px]:hidden",
        scrolled
          ? "bg-app-card-op shadow-lg rounded-b-lg"
          : "bg-app-foreground shadow-md"
      )}
    >
      <AppLogo white={true} />
      <NavList
        items={[
          { name: "الرئيسية", href: "#HEADER" },
          { name: "عن النظام", href: "#ABOUT" },
          // { name: "التعليمات", href: "#INSTRUCTIONS" },
          { name: "فريق العمل", href: "#Team" },
        ]}
      />
      {
        authUser ? <Link
        href={RoutesName.DASHBOARD}
        className="bg-white font-bold hover:bg-app-secondary text-app-foreground hover:text-app-secondary-foreground transition-colors duration-300 py-2 px-3 rounded-md"
      >
        لوحة التحكم
      </Link> : <Link
        href={RoutesName.LOGIN}
        className="bg-white font-bold hover:bg-app-secondary text-app-foreground hover:text-app-secondary-foreground transition-colors duration-300 py-2 px-3 rounded-md"
      >
        تسجيل الدخول
      </Link>
      }
    </nav>
  );
}
