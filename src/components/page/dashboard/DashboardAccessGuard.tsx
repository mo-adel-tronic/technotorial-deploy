"use client";
import { usePathname } from "next/navigation";
import ForbiddenPage from "@/app/forbidden/page";

interface Props {
  session: any;
  children: React.ReactNode;
}
export default function DashboardAccessGuard({ session, children }: Props) {
  const pathname = usePathname();

  if (
    session?.user.jobs &&
    !session.user.jobs.includes("مسؤل") &&
    !session.user.jobs.includes("عضو لجنة") &&
    !pathname.includes("subdashboard")
  ) {
    return <ForbiddenPage />;
  }
  if (
    session?.user.jobs &&
    !session.user.jobs.includes("مسؤل") &&
    (pathname.includes("department") ||
      pathname.includes("teacher") ||
      pathname.includes("programs"))
  ) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}