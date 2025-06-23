import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import TeacherForm from "@/components/page/teacher/TeacherForm";
import { RoutesName } from "@/constants/RoutesName";

export default function TeacherCreate() {
  return (
    <>
    <HeaderBanner title='إضافة عضو جديد' linkCreate={{
            text: 'العودة إلى إدارة أعضاء هيئة التدريس',
            href: RoutesName.TEACHER
        }} />

    <TeacherForm />
    </>
  )
}
