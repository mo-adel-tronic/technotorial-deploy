import LoadingPage from "@/app/loading";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import DepartmentForm from "@/components/page/department/DepartmentForm";
import { RoutesName } from "@/constants/RoutesName";
import { fetchDepartment } from "@/features/department/DepartmentRepo";
import { Suspense } from "react";

export default async function DepartmentEdit({
  params,
}: {
  params: Promise<{ departid: number }>;
}) {
  const { departid } = await params;
  return (
    <>
      <HeaderBanner
        title="تعديل القسم"
        linkCreate={{
          text: "العودة إلى إدارة القسم العلمي",
          href: RoutesName.DEPARTMENT,
        }}
      />
      <Suspense fallback={<LoadingPage />}>
        <DepartmentEditLoaded departid={departid} />
      </Suspense>
    </>
  );
}

async function DepartmentEditLoaded({ departid }: { departid: number }) {
  const department = await fetchDepartment(departid);
  return (
    <>
      {department ? (
        <DepartmentForm
          isEditMode={true}
          id={departid}
          defaultValues={{
            name: department.name,
            depart_code: department.depart_code,
          }}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
          <h1>لا يوجد بيانات لهذا القسم</h1>
        </div>
      )}
    </>
  );
}
