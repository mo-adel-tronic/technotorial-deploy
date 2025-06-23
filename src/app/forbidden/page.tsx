import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <h1 className="text-6xl font-bold text-primary mb-4">403</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        ليس لديك إذن الوصول لهذه الصفحة
      </p>
      <Button asChild>
        <Link href="/">العودة إلى الصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
