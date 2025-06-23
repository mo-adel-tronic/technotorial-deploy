import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import RequirementTable from "@/components/page/programs/RequirementsTable";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { fetchDepartment } from "@/features/department/DepartmentRepo";
import { fetchProgram } from "@/features/programs/ProgramsRepo";
import { fetchRequirement } from "@/features/requirements/RequirementRepo";

export default async function ProgramView({params} : {params: Promise<{programsid: number}>}) {
    const {programsid} = await params
    const program = await fetchProgram(programsid);
    const depart = await fetchDepartment(program?.depart_id || 0)
    const req = await fetchRequirement(programsid)
  return (
    <>
    <HeaderBanner title='بيانات البرنامج' linkCreate={{
            text: 'العودة إلى إدارة البرامج الدراسية',
            href: RoutesName.PROGRAMS
        }} />

    {
        program ? (<>
        <ViewBox data={[
            {
                k: "اسم البرنامج",
                v: program.name
            },
            {
                k: "كود البرنامج",
                v: program.program_code
            },
            {
                k: "عدد ساعات الرسالة",
                v: program.paper_hours.toString()
            },
            {
                k: "عدد ساعات المقررات",
                v: program.subject_hours.toString()
            },
            {
                k: "القسم التابع له",
                v: depart ? depart.name : 'غير معرف'
            },
        ]} />
        <div className="mt-16">
            <HeaderBanner title="متطلبات البرنامج" linkCreate={{
            text: 'إنشاء متطلب جديد',
            href: RoutesName.PROGRAMS + '/' + programsid.toString() + RoutesName.REQUIREMENTS + '/create'
        }} />
            <div className="space-y-6">
                <RequirementTable data={req || []} programId={programsid} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا البرنامج</h1>
            </div>
        )
    }
    </>
  )
}
