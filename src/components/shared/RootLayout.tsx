// components/shared/RootRender.tsx
'use client';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/app/error';
import LoadingPage from '@/app/loading';

export default function RootRender({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
    }
  }, []);

  if (width === null) return <LoadingPage />;

  if (width < 768) {
    return <ErrorBoundary error={new Error('مقاس الشاشة لابد أن يكون أكبر من 768')} />;
  }

  return (
    <>
      {children}
      <Toaster
        toastOptions={{
          classNames: {
            success: '!bg-green-600 !text-white !font-bold',
            error: '!bg-red-500 !text-white !font-bold',
          },
        }}
      />
    </>
  );
}