export interface Teacher {
  readonly id?: number;
  name: string;
  email: string;
  degree: "أ.د" | "أ.م.د" | "د" | "م.م" | "م";
  t_order: number;
  access_token?: string | null;
}
export type JobsType =
  | "مسؤل"
  | "المرشد الأكاديمي العام"
  | "نائب المرشد الأكاديمي العام"
  | "مرشد أكاديمي"
  | "مدرس"
  | "عضو لجنة";
export interface TeacherJobs {
  readonly id?: number;
  job: JobsType;
  teacher_id: number;
  depart_id: number;
}

export interface Department {
  readonly id?: number;
  name: string;
  depart_code: string;
}

export interface Specialization {
  readonly id?: number;
  name: string;
  depart_id: number;
}

export interface Programs {
  readonly id?: number;
  name: string;
  subject_hours: number;
  paper_hours: number;
  program_code: string;
  depart_id: number;
}

export interface Requirements {
  readonly id?: number;
  name: string;
  credit_hour: number;
  type: "اختياري" | "إجباري";
  require_code: string;
  program_id: number;
}

export interface Subjects {
  readonly id?: number;
  name: string;
  subject_code: string;
  theoretical_hour: number;
  practical_hour: number;
  credit_hour: number;
  theoretical_exam_duration: number;
  practical_exam_duration: number;
  theoretical_degree: number;
  practical_degree: number;
  activity_degree: number;
  require_id: number;
}

export interface Researchers {
  readonly id?: number;
  name: string;
  registered_at?: string;
  student_code: string;
  national_n?: string;
  phone?: string;
  nation_phone?: string;
  advisor?: number;
  specialization_id: number;
  program_id: number;
}

export interface ResearcherDetails {
  readonly id?: number;
  name: string;
  registered_at?: string;
  student_code: string;
  national_n?: string;
  phone?: string;
  nation_phone?: string;
  advisorName?: string;
  specializeName: string;
  departName: string;
  programName: string;
  statusList: {k: string, color: string}[] | string;
}

export type StudentStatusCases = 'مستجد' | 'سحب ملف' | 'إيقاف قيد' | 'جاري الدراسة' | 'تم التسجيل' | 'استوفى الدراسة' | 'ناقش'
export const studentStatusCases = ['مستجد' , 'سحب ملف' , 'إيقاف قيد' , 'جاري الدراسة' , 'تم التسجيل' , 'استوفى الدراسة' , 'ناقش']
export interface StudentStatus {
  readonly id?: number;
  name: StudentStatusCases | undefined;
  student_id: number;
}
export interface StudentSemesterListType {
  id: number,
  name: string,
  status: string[]
}

export type SemesterTerm = "صيفي" | "خريفي" | "ربيعي"
export const semesterTerm = ["صيفي" , "خريفي" , "ربيعي"]
export interface Semester {
  readonly id?: number;
  edu_year: string;
  term: SemesterTerm;
  semester: number
}

export interface Classroom {
  readonly id?: number;
  duration_plans: number;
  subject_id: number;
  teacher_id: number
}

export interface ClassroomDetails {
  readonly id?: number;
  subjectName: string;
  teacherName: string;
  programName: string;
}

export interface ClassroomForView {
  readonly id?: number;
  subjectName: string;
  teacherName: string;
  programId: number | undefined;
  programName: string;
  departName: string;
  reqName: string;
  reqType: string;
}

export type ClassroomStudentStatus = 'اجتاز' | "اخفق" | 'قيد الدراسة'
export const classroomStudentStatus = ['اجتاز' , "اخفق", 'قيد الدراسة']
export interface ClassroomStudent {
  readonly id?: number;
  student_id: number;
  classroom_id: number;
  st_status: ClassroomStudentStatus
}

export interface ClassroomStudentDetails {
  readonly id?: number;
  student_id: number;
  studentName: string;
  st_status: ClassroomStudentStatus | undefined
}

export interface ClassroomForEdit {
  readonly id?: number;
  depart_id: number;
  teacher_id: number;
  program_id: number;
  req_id: number;
  subject_id: number;
}

export interface DB {
  teachers: Teacher;
  department: Department;
  specialization: Specialization;
  teachers_jobs: TeacherJobs;
  learning_programs: Programs;
  program_requirements: Requirements;
  subjects: Subjects;
  students: Researchers;
  student_status: StudentStatus;
  duration_plans: Semester;
  classrooms: Classroom;
  results: ClassroomStudent;
}
