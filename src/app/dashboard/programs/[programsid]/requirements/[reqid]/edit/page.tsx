import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import RequirementForm from "@/components/page/requirements/RequirementForm";
import { RoutesName } from "@/constants/RoutesName";
import { fetchRequirementById } from "@/features/requirements/RequirementRepo";

export default async function RequirementEdit({
  params,
}: {
  params: Promise<{ programsid: number; reqid: number }>;
}) {
  const { programsid, reqid } = await params;
  const requirement = await fetchRequirementById(reqid);
  return (
    <>
      <HeaderBanner
        title="تعديل بيانات المتطلب"
        linkCreate={{
          text: "العودة إلى إدارة المتطلبات الدراسية",
          href: RoutesName.PROGRAMS + "/" + programsid.toString(),
        }}
      />

      {requirement ? (
        <RequirementForm
          isEditMode={true}
          id={reqid}
          program_id={programsid}
          defaultValues={{
            name: requirement.name,
            type: requirement.type,
            credit_hour: requirement.credit_hour,
            require_code: requirement.require_code
          }}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
          <h1>لا يوجد بيانات لهذا المتطلب</h1>
        </div>
      )}
    </>
  );
}
