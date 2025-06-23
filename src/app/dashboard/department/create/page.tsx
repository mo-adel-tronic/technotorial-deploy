import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import DepartmentForm from "@/components/page/department/DepartmentForm";
import { RoutesName } from "@/constants/RoutesName";

export default function DepartmentCreate() {
  return (
    <>
    <HeaderBanner title='إضافة قسم جديد' linkCreate={{
            text: 'العودة إلى إدارة القسم العلمي',
            href: RoutesName.DEPARTMENT
        }} />

    <DepartmentForm />
    </>
  )
}
