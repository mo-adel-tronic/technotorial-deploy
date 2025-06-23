import ClassroomForm from "@/components/page/classtable/ClassroomForm";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import { RoutesName } from "@/constants/RoutesName";
import { fetchAllDepartments } from "@/features/department/DepartmentRepo";

export default async function ClassroomCreate({params} : {params: Promise<{semesterid: number}>}) {
    const {semesterid} = await params
    const departs = await fetchAllDepartments()
  return (
    <>
    <HeaderBanner title='تعيين مقرر جديد' linkCreate={{
            text: 'العودة إلى إدارة الجدول الدراسي',
            href: `${RoutesName.SEMESTERS}/${semesterid.toString()}`
        }} />

    <ClassroomForm semesterid={semesterid} departs={departs || []} />
    </>
  )
}
