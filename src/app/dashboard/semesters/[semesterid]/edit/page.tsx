import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import SemesterForm from "@/components/page/semester/SemesterForm";
import { RoutesName } from "@/constants/RoutesName";
import { fetchSemester } from "@/features/semesters/SemesterRepo";

export default async function SemesterEdit({
  params,
}: {
  params: Promise<{ semesterid: number }>;
}) {
  const { semesterid } = await params;
  const semester = await fetchSemester(semesterid);
  return (
    <>
      <HeaderBanner
        title="تعديل المستوى"
        linkCreate={{
          text: "العودة إلى إدارة المستوى",
          href: RoutesName.SEMESTERS,
        }}
      />

      {semester ? (
        <SemesterForm
          isEditMode={true}
          id={semesterid}
          defaultValues={{
            edu_year: semester.edu_year,
            semester: semester.semester,
            term: semester.term,
          }}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
          <h1>لا يوجد بيانات لهذا المستوى</h1>
        </div>
      )}
    </>
  );
}
