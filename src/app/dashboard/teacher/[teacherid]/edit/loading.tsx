export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="text-2xl font-semibold text-muted-foreground">
        رجاء الإنتظار <br /> جاري تحميل الصفحة
        <br />
        <span className="text-primary animate-pulse">...</span>
      </h1>
    </div>
  );
}
