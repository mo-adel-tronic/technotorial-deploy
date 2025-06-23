import ClassroomTable from "@/components/page/classtable/ClassroomTable";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { fetchClassroomsBySemester } from "@/features/classrooms/ClassroomRepo";
import { fetchSemester } from "@/features/semesters/SemesterRepo";

export default async function SemesterView({params} : {params: Promise<{semesterid: number}>}) {
    const {semesterid} = await params
    const semester = await fetchSemester(semesterid);
    const classrooms = await fetchClassroomsBySemester(semesterid)
  return (
    <>
    <HeaderBanner title='بيانات المستوى' linkCreate={{
            text: 'العودة إلى إدارة المستوى',
            href: RoutesName.SEMESTERS
        }} />

    {
        semester ? (<>
        <ViewBox data={[
            {
                k: "رقم المستوى",
                v: semester.semester.toString()
            },
            {
                k: "العام الدراسي",
                v: semester.edu_year
            },
            {
                k: "الفصل الدراسي",
                v: semester.term
            },
        ]} />
        <div className="mt-16">
            <HeaderBanner title="الجدول الدراسي" linkCreate={{
            text: 'تسكين مقرر جديد',
            href: RoutesName.SEMESTERS + '/' + semesterid.toString() + RoutesName.CLASS_TABLE_CREATE
        }} />
            <div className="space-y-6">
                <ClassroomTable data={classrooms || []} semesterid={semesterid} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا المستوى</h1>
            </div>
        )
    }
    </>
  )
}
