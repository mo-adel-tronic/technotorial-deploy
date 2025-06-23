'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ErrorBoundary({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">حدث خطأ ما</h1>
      <p className="text-muted-foreground mb-8 text-center">{error.message}</p>
      <div className="flex space-x-4">
        <Button onClick={() => router.refresh()}>حاول مرة أخرى</Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}
