import generalRules from "@/lib/GlobalValidationRules"
import * as z from "zod"
export const AllowedTeacherDegree = ["أ.د" , "أ.م.د" , "د" , "م.م" , "م"]
export const TeacherSchema = z.object({
    name: z
    .string()
    .min(3, {message: "يجب أن يكون الاسم 3 أحرف على الأقل"})
    .max(90, {message: "يجب أن يكون الاسم 90 حرف كحد أقصى"})
    .refine((value) => generalRules.arabicNameRegex.rule.test(value), {
        message: generalRules.arabicNameRegex.message,
      }),
    degree: z.enum(["أ.د" , "أ.م.د" , "د" , "م.م" , "م"], {
        errorMap: () => ({
            message: "يجب اختيار درجة علمية صحيحة من القائمة"
        })
    }),
    email: z
    .string()
    .email({ message: "البريد الإلكتروني غير صالح" })
    .refine((val) => val.endsWith("@sedu.asu.edu.eg"), {
      message: "يجب أن يكون البريد الإلكتروني من نطاق sedu.asu.edu.eg@",
    }),
    t_order: z
    .string()
    .refine(value => /^\d{1,7}$/.test(value), {
        message: 'الحد الأدنى هو 1 والأقصى 9,999,999'
    })
    .refine((value) => generalRules.digitRegex.rule.test(value), {
        message: generalRules.digitRegex.message
    })
})

export type TeacherFormValues = z.infer<typeof TeacherSchema>

export const defaultTeacherValues: Partial<TeacherFormValues> = {
    name: "",
    degree: 'أ.د',
    email: '',
    t_order: '1'
  }