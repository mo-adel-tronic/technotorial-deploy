import ClassroomStudentStatusFields from "@/components/page/classtable/ClassroomStudents";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { fetchClassroomsBySemesterForView } from "@/features/classrooms/ClassroomRepo";
import { getStudentForAssignSemester } from "@/features/researchers/ResearcherRepo";

export default async function ClassroomView({params} : {params: Promise<{classid: number, semesterid: number}>}) {
    const {classid, semesterid} = await params
    const classroom = await fetchClassroomsBySemesterForView(classid);
    const students = await getStudentForAssignSemester(classroom?.programId || 0)
  return (
    <>
    <HeaderBanner title='بيانات المقرر بالجدول' linkCreate={{
            text: 'العودة إلى إدارة الجدول الدراسي',
            href: RoutesName.SEMESTERS + '/' + semesterid.toString()
        }} />

    {
        classroom ? (<>
        <ViewBox data={[
            {
                k: "اسم القسم",
                v: classroom.departName
            },
            {
                k: "اسم البرنامج",
                v: classroom.programName
            },
            {
                k: "اسم المتطلب",
                v: `${classroom.reqName} - ${classroom.reqType}`
            },
            {
                k: "اسم المقرر",
                v: classroom.subjectName
            },
            {
                k: "اسم المدرس",
                v: classroom.teacherName
            },
        ]} />
        <div className="mt-16">
            <HeaderBanner title="الطلاب الملتحقين بالمقرر" />
            <div className="space-y-6">
                <ClassroomStudentStatusFields classId={classid} studentsList={students || []} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد تعيين بيانات لهذا المقرر</h1>
            </div>
        )
    }
    </>
  )
}
