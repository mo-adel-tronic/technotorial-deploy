import generalRules from "@/lib/GlobalValidationRules"
import * as z from "zod"
export const AllowedRequirementTypes = ["اختياري" , "إجباري"]
export const RequirementsSchema = z.object({
    name: z
    .string()
    .min(3, {message: "يجب أن يكون الاسم 3 أحرف على الأقل"})
    .max(90, {message: "يجب أن يكون الاسم 90 حرف كحد أقصى"})
    .refine((value) => generalRules.arabicNameRegex.rule.test(value), {
        message: generalRules.arabicNameRegex.message,
      }),
    require_code: z
    .string()
    .min(1, {message: "يجب أن يكون كود المتطلب حرف واحد على الأقل"})
    .max(2, {message: "يجب أن يكون كود المتطلب حرفين كحد أقصى"})
    .toUpperCase(),
    credit_hour: z
    .number()
    .min(1, {message: "يجب ألا يقل عدد الساعات عن 1 ساعة"})
    .max(255, { message: "يجب ألا تتجاوز الساعات 255" }),
    type: z
    .enum(["اختياري" , "إجباري"], {message: "لقد تم اختيار حالة غير موجودة ضمن القائمة"})
})

export type RequirementsFormValues = z.infer<typeof RequirementsSchema>

export const defaultRequirementsValues: Partial<RequirementsFormValues> = {
    name: undefined,
    require_code: undefined,
    type: undefined,
    credit_hour: 0
  }