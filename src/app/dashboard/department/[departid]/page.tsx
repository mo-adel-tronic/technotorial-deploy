import LoadingPage from "@/app/loading";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import Specialization from "@/components/page/department/Specialization";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { fetchDepartment } from "@/features/department/DepartmentRepo";
import { Suspense } from "react";

export default async function DepartmentView({params} : {params: Promise<{departid: number}>}) {
    const {departid} = await params
    return <>
    <HeaderBanner title='بيانات القسم' linkCreate={{
            text: 'العودة إلى إدارة القسم العلمي',
            href: RoutesName.DEPARTMENT
        }} />
    <Suspense fallback={<LoadingPage />}>
    <DepartmentViewLoaded departid={departid} />
  </Suspense>
    </>
}

async function DepartmentViewLoaded ({departid} : {departid: number}) {
    const department = await fetchDepartment(departid);
  return (
    <>

    {
        department ? (<>
        <ViewBox data={[
            {
                k: "اسم القسم",
                v: department.name
            },
            {
                k: "كود القسم",
                v: department.depart_code
            },
        ]} />
        <div className="mt-16">
            <HeaderBanner title="تخصصات القسم" />
            <div className="space-y-6">
                <Specialization departId={departid} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا القسم</h1>
            </div>
        )
    }
    </>
  )
}
