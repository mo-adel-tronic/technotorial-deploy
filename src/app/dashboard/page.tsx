import DashboardLottie from "@/components/page/dashboard/LottieDash";

export default function Dashboard() {
  return (
    <div>
      <DashboardLottie />
      <div>
        <h1 className="text-center font-bold text-3xl my-8">
            أهلاً ومرحباً بك في منصة <span className="text-app-secondary">TechnoTorial</span> المسؤلة عن إدارة لجنة الدرسات العليا وخدمات الباحثين
        </h1>
      </div>
    </div>
  );
}
