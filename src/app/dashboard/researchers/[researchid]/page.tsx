import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ResearcherStatusFields from "@/components/page/researchers/ResearcherStatus";
import ViewBox from "@/components/shared/ViewBox";
import { RoutesName } from "@/constants/RoutesName";
import { viewReseacher } from "@/features/researchers/ResearcherRepo";

export default async function ResearcherView({params} : {params: Promise<{researchid: number}>}) {
    const {researchid} = await params
    const researcher = await viewReseacher(researchid);
  return (
    <>
    <HeaderBanner title='بيانات الباحث' linkCreate={{
            text: 'العودة إلى إدارة الباحثين',
            href: RoutesName.RESEARCHERS
        }} />

    {
        researcher ? (<>
        <ViewBox data={[
            {
                k: "اسم الباحث",
                v: researcher.name
            },
            {
                k: "تاريخ القيد",
                v: researcher.registered_at!
            },
            {
                k: "كود الباحث",
                v: researcher.student_code
            },
            {
                k: "الرقم القومي",
                v: researcher.national_n!
            },
            {
                k: "رقم الهاتف",
                v: researcher.phone!,
            },
            {
                k: "رقم الهاتف الوطني",
                v: researcher.nation_phone!,
            },
            {
                k: "المرشد الأكاديمي",
                v: researcher.advisorName!,
            },
            {
                k: "القسم",
                v: researcher.departName,
            },
            {
                k: "التخصص",
                v: researcher.specializeName,
            },
            {
                k: "البرنامج",
                v: researcher.programName,
            },
        ]} />
        <div className="mt-16">
            <HeaderBanner title="حالات الباحث" />
            <div className="space-y-6">
                <ResearcherStatusFields researchid={researchid} />
            </div>
        </div>
        </>) : (
            <div className="flex justify-center items-center text-center text-3xl font-bold text-app-primary">
                <h1>لا يوجد بيانات لهذا الباحث</h1>
            </div>
        )
    }
    </>
  )
}
