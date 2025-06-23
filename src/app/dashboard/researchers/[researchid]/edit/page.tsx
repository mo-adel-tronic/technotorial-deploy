import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ResearcherForm from "@/components/page/researchers/ResearcherForm";
import { RoutesName } from "@/constants/RoutesName";
import { fetchResearcher } from "@/features/researchers/ResearcherRepo";

export default async function ResearchEdit({params} : {params: Promise<{researchid: number}>}) {
    const {researchid} = await params
    const researcher = await fetchResearcher(researchid);
  return (
    <>
    <HeaderBanner title='تعديل بيانات الباحث' linkCreate={{
            text: 'العودة إلى إدارة بيانات الباحث',
            href: RoutesName.RESEARCHERS
        }} />

    {
        researcher ? (<ResearcherForm isEditMode={true} id={researchid} defaultValues={researcher}/>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا الباحث</h1>
            </div>
        )
    }
    </>
  )
}
