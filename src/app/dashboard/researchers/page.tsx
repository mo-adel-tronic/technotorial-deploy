import LoadingPage from "@/app/loading";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ResearcherTable from "@/components/page/researchers/ResearchersTable";
import { RoutesName } from "@/constants/RoutesName";
import { ResearcherDetails } from "@/db/types";
import { fetchAllResearchersDetails } from "@/features/researchers/ResearcherRepo";
import { Suspense } from "react";

export default function Researcher() {
  return <Suspense fallback={<LoadingPage />}>
    <ResearcherLoaded />
  </Suspense>
}

async function ResearcherLoaded () {
  const researchers : ResearcherDetails[] | undefined = await fetchAllResearchersDetails();
  return (
    <>
      <HeaderBanner
        title="إدارة الباحثين"
        linkCreate={{
          text: "إضافة باحث جديد",
          href: RoutesName.RESEARCHERS_CREATE,
        }}
      />
      <ResearcherTable data={researchers || []} />
    </>
  );
}
