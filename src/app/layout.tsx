import RootRender from "@/components/shared/RootLayout";
import { ImageSrc } from "@/constants/MediaSrc";
import type { Metadata } from "next";
import '@/styles/globals.css'

const meta = {
  title: 'TechnoTorial - منصة إدارة الدراسات العليا بقسم تكنولوجيا التعليم',
  description: 'منصة تكنو توريال لإدارة بيانات الدراسات العليا، تدعم الباحثين والمعلمين وتوفر لهم المعلومات والأدوات اللازمة لتسهيل العمليات الأكاديمية بقسم تكنولوجيا التعليم، كلية التربية النوعية، جامعة عين شمس.',
  image: ImageSrc.LOGO,
  type: 'website',
  url: 'https://technotorial.com',
};

export const metadata: Metadata = {
  metadataBase: new URL(meta.url),
  title: {
    default: meta.title,
    template: `%s | Techno Torial`,
  },
  description: meta.description,
  keywords: [
    'programming',
    'technology',
    'tutorials',
    'articles',
    'resources',
    'learn to code',
  ],
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.url,
    siteName: 'Techno Torial',
    images: [
      {
        url: meta.image,
        width: 800,
        height: 600,
        alt: 'Techno Torial Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: [meta.image],
  },
  manifest: '/manifest.json',
  icons: {
    icon: ImageSrc.LOGO_ICON,
    apple: ImageSrc.LOGO,
  },
  themeColor: '#ffffff',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootRender>
    {children}
  </RootRender>
}
