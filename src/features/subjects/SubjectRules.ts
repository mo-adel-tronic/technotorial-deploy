import * as z from "zod";
export const SubjectsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" })
    .max(90, { message: "يجب أن يكون الاسم 90 حرف كحد أقصى" }),
  subject_code: z
    .string()
    .min(1, { message: "يجب أن يكون كود المقرر حرف واحد على الأقل" })
    .max(3, { message: "يجب أن يكون كود المقرر 3 أحرف كحد أقصى" })
    .toUpperCase(),
  theoretical_hour: z
    .number()
    .max(255, { message: "يجب ألا تتجاوز الساعات 255" }),
  practical_hour: z
    .number()
    .max(255, { message: "يجب ألا تتجاوز الساعات 255" }),
  credit_hour: z.number().max(255, { message: "يجب ألا تتجاوز الساعات 255" }),
  theoretical_exam_duration: z
    .number()
    .max(65000, { message: "يجب ألا تتجاوز الدقائق 65000" }),
  practical_exam_duration: z
    .number()
    .max(65000, { message: "يجب ألا تتجاوز الدقائق 65000" }),
  theoretical_degree: z
    .number()
    .max(65000, { message: "يجب ألا تتجاوز الدرجات 65000" }),
  practical_degree: z
    .number()
    .max(65000, { message: "يجب ألا تتجاوز الدرجات 65000" }),
  activity_degree: z
    .number()
    .max(65000, { message: "يجب ألا تتجاوز الدرجات 65000" }),
});

export type SubjectsFormValues = z.infer<typeof SubjectsSchema>;

export const defaultSubjectsValues: Partial<SubjectsFormValues> = {
  name: '',
  subject_code: '',
  theoretical_hour: 0,
  practical_hour: 0,
  credit_hour: 0,
  theoretical_exam_duration: 0,
  practical_exam_duration: 0,
  theoretical_degree: 0,
  practical_degree: 0,
  activity_degree: 0
};
