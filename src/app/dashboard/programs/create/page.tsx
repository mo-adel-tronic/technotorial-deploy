import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ProgramForm from "@/components/page/programs/ProgramsForm";
import { RoutesName } from "@/constants/RoutesName";

export default function ProgramsCreate() {
  return (
    <>
    <HeaderBanner title='إضافة برنامج جديد' linkCreate={{
            text: 'العودة إلى إدارة البرامج الدراسية',
            href: RoutesName.PROGRAMS
        }} />

    <ProgramForm />
    </>
  )
}
