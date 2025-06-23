import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import SubjectForm from "@/components/page/subjects/SubjectForm";
import { RoutesName } from "@/constants/RoutesName";

export default async function SubjectCreate({params} : {params: Promise<{reqid: number, programsid: number}>}) {
    const {reqid, programsid} = await params
  return (
    <>
    <HeaderBanner title='إضافة مقرر جديد' linkCreate={{
            text: 'العودة إلى إدارة مقررات البرنامج',
            href: RoutesName.PROGRAMS + '/' + programsid.toString() + RoutesName.REQUIREMENTS + '/' + reqid.toString()
        }} />

    <SubjectForm program_id={programsid} require_id={reqid} />
    </>
  )
}
