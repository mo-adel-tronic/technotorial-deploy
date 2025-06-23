import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import SubjectForm from "@/components/page/subjects/SubjectForm";
import { RoutesName } from "@/constants/RoutesName";
import { fetchSubjectById } from "@/features/subjects/SubjectRepo";

export default async function SubjectEdit({
  params,
}: {
  params: Promise<{ programsid: number; reqid: number; subjectid: number }>;
}) {
  const { programsid, reqid, subjectid } = await params;
  const subject = await fetchSubjectById(subjectid);
  return (
    <>
      <HeaderBanner
        title="تعديل بيانات المقرر"
        linkCreate={{
          text: "العودة إلى إدارة المقررات الدراسية",
          href: RoutesName.PROGRAMS + "/" + programsid.toString() + RoutesName.REQUIREMENTS + '/' + reqid.toString(),
        }}
      />

      {subject ? (
        <SubjectForm
          isEditMode={true}
          id={subjectid}
          program_id={programsid}
          require_id={reqid}
          defaultValues={{
            name: subject.name,
          subject_code: subject.subject_code,
          theoretical_hour: subject.theoretical_hour,
          practical_hour: subject.practical_hour,
          credit_hour: subject.credit_hour,
          theoretical_exam_duration: subject.theoretical_exam_duration,
          practical_exam_duration: subject.practical_exam_duration,
          theoretical_degree: subject.theoretical_degree,
          practical_degree: subject.practical_degree,
          activity_degree: subject.activity_degree,
          }}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
          <h1>لا يوجد بيانات لهذا المقرر</h1>
        </div>
      )}
    </>
  );
}
