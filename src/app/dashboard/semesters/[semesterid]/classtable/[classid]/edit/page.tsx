import ClassroomForm from "@/components/page/classtable/ClassroomForm";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import { RoutesName } from "@/constants/RoutesName";
import { fetchClassroomForEdit } from "@/features/classrooms/ClassroomRepo";
import { fetchAllDepartments } from "@/features/department/DepartmentRepo";

export default async function ClassroomEdit({
  params,
}: {
  params: Promise<{ classid: number; semesterid: number }>;
}) {
  const { classid, semesterid } = await params;
  const data = await fetchClassroomForEdit(classid);
  const departs = await fetchAllDepartments();
  return (
    <>
      <HeaderBanner
        title="تعديل المقرر بالجدول"
        linkCreate={{
          text: "العودة إلى إدارة الجدول",
          href: RoutesName.SEMESTERS + "/" + semesterid.toString(),
        }}
      />

      {data ? (
        <ClassroomForm
          semesterid={semesterid}
          departs={departs || []}
          isEditMode={true}
          id={classid}
          defaultValues={{
            depart_id: data.depart_id,
            teacher_id: data.teacher_id,
            program_id: data.program_id,
            req_id: data.req_id,
            subject_id: data.subject_id,
          }}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
          <h1>لا يوجد تعيين لهذا المقرر</h1>
        </div>
      )}
    </>
  );
}
