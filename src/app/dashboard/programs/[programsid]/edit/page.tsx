import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ProgramForm from "@/components/page/programs/ProgramsForm";
import { RoutesName } from "@/constants/RoutesName";
import { fetchProgram } from "@/features/programs/ProgramsRepo";

export default async function ProgramEdit({
  params,
}: {
  params: Promise<{ programsid: number }>;
}) {
  const { programsid } = await params;
  const program = await fetchProgram(programsid);
  return (
    <>
      <HeaderBanner
        title="تعديل بيانات البرنامج"
        linkCreate={{
          text: "العودة إلى إدارة البرامج الدراسية",
          href: RoutesName.PROGRAMS,
        }}
      />

      {program ? (
        <ProgramForm
          isEditMode={true}
          id={programsid}
          defaultValues={{
            name: program.name,
            depart_id: Number(program.depart_id),
            paper_hours: program.paper_hours,
            subject_hours: program.subject_hours,
            program_code: program.program_code,
          }}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
          <h1>لا يوجد بيانات لهذا البرنامج</h1>
        </div>
      )}
    </>
  );
}
