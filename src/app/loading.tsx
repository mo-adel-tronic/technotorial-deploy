export default function LoadingPage() {
  return (
    <div className="flex h-screen fixed top-0 right-0 w-screen flex-col items-center justify-center bg-black/15 p-6 text-center">
      <h1 className="text-2xl font-semibold text-muted-foreground">
        رجاء الإنتظار <br /> جاري تحميل الصفحة
        <br />
        <span className="text-primary animate-pulse">...</span>
      </h1>
    </div>
  );
}
