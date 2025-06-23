import { JobsType } from "@/db/types";

export interface JobsWithDepartment {
    id: number,
    job: JobsType | undefined,
    departName: string,
    depart_id: number,
    teacher_id: number
}