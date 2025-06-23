import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ResearcherForm from "@/components/page/researchers/ResearcherForm";
import { RoutesName } from "@/constants/RoutesName";

export default function ResearcherCreate() {
  return (
    <>
    <HeaderBanner title='إضافة باحث جديد' linkCreate={{
            text: 'العودة إلى إدارة الباحثين',
            href: RoutesName.RESEARCHERS
        }} />

    <ResearcherForm />
    </>
  )
}