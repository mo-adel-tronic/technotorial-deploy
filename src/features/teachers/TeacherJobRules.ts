import * as z from "zod"
export const AllowedTeacherJobs = ['مسؤل' , 'المرشد الأكاديمي العام' , 'نائب المرشد الأكاديمي العام' , 'مرشد أكاديمي' , 'مدرس' , 'عضو لجنة']
export const TeacherJobsSchema = z.object({
    job: z
    .enum(['مسؤل' , 'المرشد الأكاديمي العام' , 'نائب المرشد الأكاديمي العام' , 'مرشد أكاديمي' , 'مدرس' , 'عضو لجنة'], {
        errorMap: () => ({
            message: "يجب اختيار وظيفة صحيحة من القائمة"
        })
    }),
})

export type TeacherJobsFormValues = z.infer<typeof TeacherJobsSchema>

export const defaultTeacherJobsValues: Partial<TeacherJobsFormValues> = {
    job: 'مدرس'
  }