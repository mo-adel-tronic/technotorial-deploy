import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { fetchSubjectById } from "@/features/subjects/SubjectRepo";
import { getArabicExamDuration } from "@/lib/utils";

export default async function SubjectView({params} : {params: Promise<{programsid: number, reqid: number, subjectid: number}>}) {
    const {programsid, reqid, subjectid} = await params
    const subject = await fetchSubjectById(subjectid);
  return (
    <>
    <HeaderBanner title='بيانات المقرر' linkCreate={{
          text: "العودة إلى إدارة المقررات الدراسية",
          href: RoutesName.PROGRAMS + "/" + programsid.toString() + RoutesName.REQUIREMENTS + '/' + reqid.toString(),
        }} />

    {
        subject ? (<>
        <ViewBox data={[
            {
                k: "اسم المقرر",
                v: subject.name
            },
            {
                k: "كود المقرر",
                v: subject.subject_code
            },
            {
                k: "عدد ساعات المعتمدة",
                v: subject.credit_hour.toString()
            },
            {
                k: "عدد ساعات النظري",
                v: subject.theoretical_hour.toString()
            },
            {
                k: "عدد ساعات التطبيقي",
                v: subject.practical_hour.toString()
            },
            {
                k: "درجة النظري",
                v: subject.theoretical_degree.toString()
            },
            {
                k: "درجة التطبيقي",
                v: subject.practical_degree.toString()
            },
            {
                k: "درجة أعمال السنة",
                v: subject.activity_degree.toString()
            },
            {
                k: "زمن اختبار النظري",
                v: getArabicExamDuration(subject.theoretical_exam_duration)
            },
            {
                k: "زمن اختبار التطبيقي",
                v: getArabicExamDuration(subject.practical_exam_duration)
            },
        ]} />
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا المقرر</h1>
            </div>
        )
    }
    </>
  )
}
