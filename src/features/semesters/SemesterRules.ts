import { semesterTerm } from "@/db/types";
import generalRules from "@/lib/GlobalValidationRules";
import * as z from "zod";
export const SemesterSchema = z.object({
  edu_year: z.preprocess(
    (val) => val != null ? String(val) : "",
    z
      .string()
      .length(4, { message: "يجب أن يكون العام الدراسي 4 أرقام" })
      .refine((value) => generalRules.digitRegex.rule.test(value), {
        message: "يجب أن يتكون العام الدراسي على أرقام فقط",
      })
  ),
  term: z.enum(semesterTerm as [string, ...string[]], {
    errorMap: () => ({ message: "يجب اختيار فصل دراسي صحيح" }),
  }),
  semester: z.number().max(255, { message: "يجب ألا تتجاوز المستويات 255" }),
});

export type SemesterFormValues = z.infer<typeof SemesterSchema>;

export const defaultSemesterValues: Partial<SemesterFormValues> = {
  edu_year: undefined,
  term: undefined,
  semester: 1,
};
