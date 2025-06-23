import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        الصفحة التي تبحث عنها غير موجودة.
        <br /> قد تكون قد كتبت عنوان URL بشكل غير صحيح أو أن الصفحة قد تمت إزالتها.
      </p>
      <Button asChild>
        <Link href="/">العودة إلى الصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
