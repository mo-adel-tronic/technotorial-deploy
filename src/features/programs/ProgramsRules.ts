import generalRules from "@/lib/GlobalValidationRules"
import * as z from "zod"
import { fetchDepartment } from "../department/DepartmentRepo"
export const ProgramsSchema = z.object({
    name: z
    .string()
    .min(3, {message: "يجب أن يكون الاسم 3 أحرف على الأقل"})
    .max(90, {message: "يجب أن يكون الاسم 90 حرف كحد أقصى"})
    .refine((value) => generalRules.arabicNameRegex.rule.test(value), {
        message: generalRules.arabicNameRegex.message,
      }),
    program_code: z
    .string()
    .min(1, {message: "يجب أن يكون كود البرنامج حرف واحد على الأقل"})
    .max(4, {message: "يجب أن يكون كود البرنامج 4 أحرف كحد أقصى"})
    .toUpperCase(),
    subject_hours: z
    .number()
    .max(255, { message: "يجب ألا تتجاوز الساعات 255" }),
    paper_hours: z
    .number()
    .max(255, { message: "يجب ألا تتجاوز الساعات 255" }),
    depart_id: z.number()
    .refine(
        async (id) => {
            const res = await fetchDepartment(id)
            return res ? true : false
        },
        { message: "القسم غير موجود" }
    )
})

export type ProgramsFormValues = z.infer<typeof ProgramsSchema>

export const defaultProgramsValues: Partial<ProgramsFormValues> = {
    name: "",
    program_code: '',
    paper_hours: 0,
    subject_hours: 0,
    depart_id: 0
  }