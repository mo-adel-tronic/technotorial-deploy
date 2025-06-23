import { Programs } from "@/db/types";

export type ProgramsClient = Programs & { depart_name: string }