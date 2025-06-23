import RootRender from "@/components/shared/RootLayout";
import { ImageSrc } from "@/constants/MediaSrc";
import type { Metadata } from "next";
import '@/styles/globals.css'

export const metadata: Metadata = {
  icons: ImageSrc.LOGO_ICON,
  title: {
    default: "Techno Torial Admin",
    template: "%s | Techno Torial Admin",
  }
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootRender>
    {children}
  </RootRender>
}
