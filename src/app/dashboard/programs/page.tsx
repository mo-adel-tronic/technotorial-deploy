import LoadingPage from "@/app/loading";
import HeaderBanner from "@/components/page/dashboard/HeaderBanner";
import ProgramsTable from "@/components/page/programs/ProgramsTable";
import { RoutesName } from "@/constants/RoutesName";
import { fetchAllPrograms } from "@/features/programs/ProgramsRepo";
import { Suspense } from "react";

export default function Programs() {
  return <>
   <HeaderBanner title='إدارة البرامج الدراسية' linkCreate={{
        text: 'إضافة برنامج جديد',
        href: RoutesName.PROGRAMS_CREATE
    }} />
  <Suspense fallback={<LoadingPage />}>
    <ProgramsLoaded />
  </Suspense>
  </>
}

async function ProgramsLoaded () {
  const programs = await fetchAllPrograms()
  return <ProgramsTable data={programs || []} />
}