import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import TeacherTable from "@/components/page/teacher/TeacherTable";
import { RoutesName } from "@/constants/RoutesName";
import { fetchAllTeachers } from "@/features/teachers/TeacherRepo";

export default async function Teacher() {
  const teachers = await fetchAllTeachers()
  console.log(teachers)
  return (
    <>
    <HeaderBanner title='إدارة أعضاء هيئة التدريس' linkCreate={{
        text: 'إضافة عضو جديد',
        href: RoutesName.TEACHER_CREATE
    }} />
    <TeacherTable data={teachers || []} />
    
    </>
  )
}
