import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import SubjectTable from "@/components/page/requirements/SubjectTable";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { fetchRequirementById } from "@/features/requirements/RequirementRepo";
import { fetchSubjectByReq } from "@/features/subjects/SubjectRepo";

export default async function RequirementView({params} : {params: Promise<{programsid: number, reqid: number}>}) {
    const {programsid, reqid} = await params
    const requirement = await fetchRequirementById(reqid);
    const subjects = await fetchSubjectByReq(reqid)
  return (
    <>
    <HeaderBanner title='بيانات المتطلب' linkCreate={{
          text: "العودة إلى إدارة المتطلبات الدراسية",
          href: RoutesName.PROGRAMS + "/" + programsid.toString(),
        }} />

    {
        requirement ? (<>
        <ViewBox data={[
            {
                k: "اسم المتطلب",
                v: requirement.name
            },
            {
                k: "كود المتطلب",
                v: requirement.require_code
            },
            {
                k: "عدد ساعات المعتمدة",
                v: requirement.credit_hour.toString()
            },
            {
                k: "حالة المتطلب",
                v: requirement.type
            }
        ]} />
        <div className="mt-16">
            <HeaderBanner title="المقررات التابعة للمتطلب الدراسي" linkCreate={{
            text: 'إنشاء مقرر جديد',
            href: RoutesName.PROGRAMS + '/' + programsid.toString() + RoutesName.REQUIREMENTS + '/' + reqid.toString() + RoutesName.SUBJECTS + '/create'
        }} />
            <div className="space-y-6">
                <SubjectTable data={subjects || []} programId={programsid} reqId={reqid} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا المتطلب</h1>
            </div>
        )
    }
    </>
  )
}
