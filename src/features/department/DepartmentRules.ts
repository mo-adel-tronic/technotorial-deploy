import generalRules from "@/lib/GlobalValidationRules"
import * as z from "zod"
export const DepartmentSchema = z.object({
    name: z
    .string()
    .min(3, {message: "يجب أن يكون الاسم 3 أحرف على الأقل"})
    .max(90, {message: "يجب أن يكون الاسم 90 حرف كحد أقصى"})
    .refine((value) => generalRules.arabicNameRegex.rule.test(value), {
        message: "يجب أن يحتوي الاسم على أحرف عربية فقط",
      }),
    depart_code: z
    .string()
    .min(1, {message: "يجب أن يكون كود القسم حرف واحد على الأقل"})
    .max(4, {message: "يجب أن يكون كود القسم 4 أحرف كحد أقصى"})
    .toUpperCase()
})

export type DepartmentFormValues = z.infer<typeof DepartmentSchema>

export const defaultDepartmentValues: Partial<DepartmentFormValues> = {
    name: "",
    depart_code: ''
  }