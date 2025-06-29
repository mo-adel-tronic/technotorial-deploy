'use client'
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import ErrorBoundary from "@/app/error";
import LoadingPage from "@/app/loading";

export default function RootRender({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const currentYear = new Date().getFullYear();
    const [w, setW] = useState(0)
    useEffect(() => {
        setW(window.innerWidth)
      }, []);
      if (w == 0) {
        return <html>
            <head>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "WebSite",
                      "name": "Techno Torial منصة إدارة الدرسات العليا بقسم تكنولوجيا التعليم كلية التربية النوعية جامعة عين شمس",
                      "url": "https://technotorial.com/"
                    })
                  }}
                />
            </head>
            <body>
                <LoadingPage />
            </body>
        </html>
      }
  if (w < 768) {
    return <html>
        <head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Techno Torial منصة إدارة الدرسات العليا بقسم تكنولوجيا التعليم كلية التربية النوعية جامعة عين شمس",
                  "url": "https://technotorial.com/"
                })
              }}
            />
        </head>
        <body>
        <ErrorBoundary error={new Error('مقاس الشاشة لابد أن يكون أكبر من 768')} />
        </body>
    </html>
  } else {
    return <html lang="ar" dir="rtl">
    <head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Techno Torial منصة إدارة الدرسات العليا بقسم تكنولوجيا التعليم كلية التربية النوعية جامعة عين شمس",
            "url": "https://technotorial.com/"
          })
        }}
      />
    </head>
    <body className="font-text min-h-svh flex flex-col justify-between">
      {children}
      <Toaster toastOptions={{
        classNames: {
          success: "!bg-green-600 !text-white !font-bold",
          error: "!bg-red-500 !text-white !font-bold"
        }
      }} />
      <footer className="text-app-foreground text-sm py-3 text-center bg-gray-100">
        <p>Techno Torial &copy; {currentYear}</p>
      </footer>
    </body>
  </html>
  }
}
