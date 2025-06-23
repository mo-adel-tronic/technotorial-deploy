import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import RequirementForm from "@/components/page/requirements/RequirementForm";
import { RoutesName } from "@/constants/RoutesName";

export default async function RequirementCreate({params} : {params: Promise<{programsid: number}>}) {
    const {programsid} = await params
  return (
    <>
    <HeaderBanner title='إضافة متطلب جديد' linkCreate={{
            text: 'العودة إلى إدارة متطلبات البرنامج',
            href: RoutesName.PROGRAMS + '/' + programsid.toString()
        }} />

    <RequirementForm program_id={programsid} />
    </>
  )
}
