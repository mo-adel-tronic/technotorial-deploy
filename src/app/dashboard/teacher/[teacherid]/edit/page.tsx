import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import TeacherForm from "@/components/page/teacher/TeacherForm";
import { RoutesName } from "@/constants/RoutesName";
import { findTeacherById } from "@/features/teachers/TeacherRepo";

export default async function TeacherEdit({params} : {params: Promise<{teacherid: number}>}) {
    const {teacherid} = await params
    const teacher = await findTeacherById(teacherid);
  return (
    <>
    <HeaderBanner title='تعديل بيانات العضو' linkCreate={{
            text: 'العودة إلى إدارة عضو هيئة التدريس',
            href: RoutesName.TEACHER
        }} />

    {
        teacher ? (<TeacherForm isEditMode={true} id={teacherid} defaultValues={{
            name: teacher.name,
            email: teacher.email,
            degree: teacher.degree,
            t_order: teacher.t_order.toString()
        }}/>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا العضو</h1>
            </div>
        )
    }
    </>
  )
}
