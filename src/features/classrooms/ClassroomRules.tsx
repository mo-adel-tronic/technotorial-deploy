import * as z from "zod";
import { fetchSubjectById } from "../subjects/SubjectRepo";
import { fetchDepartment } from "../department/DepartmentRepo";
import { findTeacherById } from "../teachers/TeacherRepo";
import { fetchProgram } from "../programs/ProgramsRepo";
import { fetchRequirementById } from "../requirements/RequirementRepo";
export const ClassroomSchema = z.object({
  depart_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      return Number(val);
    },
    z.number().refine(
      async (id) => {
        const res = await fetchDepartment(id);
        return res ? true : false;
      },
      { message: "القسم غير موجود" }
    )
  ),
  teacher_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      return Number(val);
    },
    z.number().refine(
      async (id) => {
        const res = await findTeacherById(id);
        return res ? true : false;
      },
      { message: "العضو غير موجود" }
    )
  ),
  program_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      return Number(val);
    },
    z.number().refine(
      async (id) => {
        const res = await fetchProgram(id);
        return res ? true : false;
      },
      { message: "البرنامج غير موجود" }
    )
  ),
  req_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      return Number(val);
    },
    z.number().refine(
      async (id) => {
        const res = await fetchRequirementById(id);
        return res ? true : false;
      },
      { message: "المتطلب غير موجود" }
    )
  ),
  subject_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      return Number(val);
    },
    z.number().refine(
      async (id) => {
        const res = await fetchSubjectById(id);
        return res ? true : false;
      },
      { message: "المقرر غير موجود" }
    )
  ),
});

export type ClassroomFormValues = z.infer<typeof ClassroomSchema>;

export const defaultClassroomValues: Partial<ClassroomFormValues> = {
  depart_id: 0,
  teacher_id: 0,
  program_id: 0,
  req_id: 0,
  subject_id: 0
};
