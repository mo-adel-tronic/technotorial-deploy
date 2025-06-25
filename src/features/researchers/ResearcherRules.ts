import generalRules from "@/lib/GlobalValidationRules";
import * as z from "zod";
import { findTeacherById } from "../teachers/TeacherRepo";
import { fetchDepartment } from "../department/DepartmentRepo";
import { fetchSpecialization } from "../department/SpecializationRepo";
import { fetchProgram } from "../programs/ProgramsRepo";
import { semesterTerm } from "@/db/types";
export const ResearcherSchema = z.object({
  name: z
    .string()
    .min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" })
    .max(90, { message: "يجب أن يكون الاسم 90 حرف كحد أقصى" })
    .refine((value) => generalRules.arabicNameRegex.rule.test(value), {
      message: generalRules.arabicNameRegex.message,
    }),
  student_code: z
    .string()
    .min(1, { message: "يجب أن يكون كود الطالب حرف واحد على الأقل" })
    .max(20, { message: "يجب أن يكون كود الطالب 20 حرف كحد أقصى" })
    .refine((value) => generalRules.digitRegex.rule.test(value), {
      message: generalRules.digitRegex.message,
    }),
    registered_at: z
    .string()
    .nullable()
    .optional()
    .refine((value) => {
      if (!value) return true; // Allow null/undefined values
      return semesterTerm.some(term => value.includes(term));
    }, {
      message: "يجب أن يحتوي القيمة على فصل دراسي صحيح (صيفي، خريفي، ربيعي)"
    }),
  national_n: z
    .string()
    .min(1, { message: "يجب أن لا يقل الرقم القومي عن رقم واحد" })
    .max(50, "يجب أن لا يزيد الرقم القومي عن 50 رقم")
    .refine((value) => generalRules.digitRegex.rule.test(value), {
      message: generalRules.digitRegex.message,
    }),
  phone: z
    .preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        return val;
      },
      z
        .string()
        .length(11, "يجب أن يتكون رقم الهاتف من 11 رقم")
        .refine((value) => generalRules.phoneRegex.rule.test(value), {
          message: generalRules.phoneRegex.message,
        })
        .nullable()
    )
    .optional(),
  nation_phone: z
    .preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        return val;
      },
      z
        .string()
        .refine((value) => generalRules.globalPhoneRegex.rule.test(value), {
          message: generalRules.globalPhoneRegex.message,
        })
        .nullable()
    )
    .optional(),
  advisor: z
    .preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        return Number(val);
      },
      z
        .number()
        .refine(
          async (id) => {
            const res = await findTeacherById(id);
            return res ? true : false;
          },
          { message: "العضو غير موجود" }
        )
        .nullable()
    )
    .optional(),
  department: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
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
  specialization_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      return Number(val);
    },
    z.number().refine(
      async (id) => {
        const res = await fetchSpecialization(id);
        return res ? true : false;
      },
      { message: "التخصص غير موجود" }
    )
  ),
  program_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
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
});

export type ResearcherFormValues = z.infer<typeof ResearcherSchema>;

export const defaultResearcherValues: Partial<ResearcherFormValues> = {
  name: undefined,
  student_code: undefined,
  registered_at: undefined,
  national_n: undefined,
  phone: undefined,
  nation_phone: undefined,
  department: undefined,
  advisor: undefined,
  specialization_id: undefined,
  program_id: undefined,
};
