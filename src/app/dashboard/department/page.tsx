import LoadingPage from "@/app/loading";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import DepartmentTable from "@/components/page/department/DepartmentTable";
import { RoutesName } from "@/constants/RoutesName";
import { fetchAllDepartments } from "@/features/department/DepartmentRepo";
import { Suspense } from "react";

export default function Department() {
  return <>
  <HeaderBanner title='إدارة القسم العلمي' linkCreate={{
        text: 'إضافة قسم علمي',
        href: RoutesName.DEPARTMENT_CREATE
    }} />
  <Suspense fallback={<LoadingPage />}>
    <DepartmentLoaded />
  </Suspense></>
}

async function DepartmentLoaded () {
  const departments = await fetchAllDepartments()
  return <DepartmentTable data={departments || []} />
}
