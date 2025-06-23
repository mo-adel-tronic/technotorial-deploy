import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import SemesterForm from "@/components/page/semester/SemesterForm";
import { RoutesName } from "@/constants/RoutesName";

export default function SemesterCreate() {
  return (
    <>
    <HeaderBanner title='إضافة مستوى جديد' linkCreate={{
            text: 'العودة إلى إدارة المستويات',
            href: RoutesName.SEMESTERS
        }} />

    <SemesterForm />
    </>
  )
}
