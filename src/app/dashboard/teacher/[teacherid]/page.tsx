import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import TeacherJobsFields from "@/components/page/teacher/TeacherJobs";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { findTeacherById } from "@/features/teachers/TeacherRepo";

export default async function TeacherView({params} : {params: Promise<{teacherid: number}>}) {
    const {teacherid} = await params
    const teacher = await findTeacherById(teacherid);
  return (
    <>
    <HeaderBanner title='بيانات العضو' linkCreate={{
            text: 'العودة إلى إدارة عضو هيئة التدريس',
            href: RoutesName.TEACHER
        }} />

    {
        teacher ? (<>
        <ViewBox data={[
            {
                k: "اسم العضو",
                v: teacher.name
            },
            {
                k: "البريد الإلكتروني",
                v: teacher.email
            },
            {
                k: "الدرجة",
                v: teacher.degree
            },
            {
                k: "الأقدمية",
                v: teacher.t_order.toString()
            },
        ]} />
        <div className="mt-16">
            <HeaderBanner title="وظائف عضو هيئة التدريس" />
            <div className="space-y-6">
                <TeacherJobsFields teacherId={teacherid} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا العضو</h1>
            </div>
        )
    }
    </>
  )
}
