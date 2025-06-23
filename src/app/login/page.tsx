import LoginButton from "@/components/page/login/LoginButton";
import AppLogo from "@/components/shared/AppLogo";

export default async function Home() {
  return (
    <main className="min-h-[calc(100vh-45px)] flex items-center justify-center bg-app-primary px-8">
      <div 
      style={{
        boxShadow: "0 0 36px 1px rgba(0, 0, 0, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }} 
      className="border-2 border-gray-100 rounded-lg p-4 w-full md:w-4/6 flex flex-col items-center justify-center">
        <AppLogo white={true} />
        <h1 className="text-lg md:text-2xl font-bold text-white my-4 ">مرحباً بك في منصة <span className="text-2xl md:text-3xl text-app-secondary font-text-en">Techno Torial</span></h1>
        <div 
        className="w-5/6 bg-gradient-to-r from-app-background/10 to-gray-300/5 text-white text-sm font-bold text-center rounded-lg p-4"
        >
          <p className="my-4">سجل دخولك باستخدام حساب Microsoft الخاص بمؤسستك التعليمية</p>
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
