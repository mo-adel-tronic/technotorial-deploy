"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RoutesName } from "@/constants/RoutesName";
import { useRevalidate } from "@/hooks/revalidate";
import { RevalidateKey } from "@/constants/RevalidateKey";
import {
  Department,
  Programs,
  Requirements,
  Subjects,
  Teacher,
} from "@/db/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClassroomFormValues,
  ClassroomSchema,
  defaultClassroomValues,
} from "@/features/classrooms/ClassroomRules";
import {
  addClassroom,
  updateClassroom,
} from "@/features/classrooms/ClassroomRepo";
import { getDepartTeachers } from "@/features/teachers/TeacherRepo";
import { fetchProgramsById } from "@/features/programs/ProgramsRepo";
import { fetchRequirement } from "@/features/requirements/RequirementRepo";
import { fetchSubjectByReq } from "@/features/subjects/SubjectRepo";

interface ClassroomFormProps {
  defaultValues?: Partial<ClassroomFormValues>;
  isEditMode?: boolean;
  id?: number;
  semesterid: number;
  departs: Department[];
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  departField: {
    label: "اختر القسم",
    placeholder: "اختر القسم",
  },
  teacherField: {
    label: "اختر مدرس المقرر",
    placeholder: "اختر مدرس المقرر",
  },
  programField: {
    label: "اختر البرنامج",
    placeholder: "اختر البرنامج",
  },
  reqField: {
    label: "اختر المتطلب",
    placeholder: "اختر المتطلب",
  },
  subjectField: {
    label: "اختر المقرر",
    placeholder: "اختر المقرر",
  },
};
export default function ClassroomForm({
  defaultValues = defaultClassroomValues,
  isEditMode = false,
  id = 0,
  semesterid,
  departs,
}: ClassroomFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departId, setDepartId] = useState<number>(0);
  const [programId, setProgramId] = useState<number>(0);
  const [reqId, setReqId] = useState<number>(0);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Programs[]>([]);
  const [selectedReq, setSelectedReq] = useState<Requirements[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subjects[]>([]);
  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(ClassroomSchema) as any,
    defaultValues: defaultValues as ClassroomFormValues,
  });
  const { revalidate } = useRevalidate();
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  useEffect(() => {
    if (departId) {
      getDepartTeachers(departId, ["مدرس"]).then((v) =>
        setSelectedTeacher(v || [])
      );
      fetchProgramsById(departId).then((v) => setSelectedProgram(v || []));
    }
  }, [departId]);
  useEffect(() => {
    if (programId) {
      fetchRequirement(programId).then((v) => setSelectedReq(v || []));
    }
  }, [programId]);
  useEffect(() => {
    if (reqId) {
      fetchSubjectByReq(reqId).then((v) => setSelectedSubject(v || []));
    }
  }, [reqId]);
  async function onSubmit(data: ClassroomFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updateClassroom({
          duration_plans: semesterid,
          subject_id: data.subject_id,
          teacher_id: data.teacher_id,
          id: id,
        });
      } else {
        res = await addClassroom({
          duration_plans: semesterid,
          subject_id: data.subject_id,
          teacher_id: data.teacher_id,
        });
      }
      await revalidate(
        RevalidateKey.AllClassrooms,
        RevalidateKey.AllClassrooms
      );
      if (!isEditMode) {
        router.push(`${RoutesName.SEMESTERS}/${semesterid}`);
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode ? `تم تعديل البيانات بنجاح` : `تمت التسكين بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل البيانات"
            : "هناك مشكلة في تسكين المقرر"
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(pageData.requestError);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 font-madani"
      >
        <div className="grid grid-cols-2 gap-x-8">
          <FormField
            control={form.control}
            name="depart_id"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.departField.label}</FormLabel>
                <FormControl>
                  <Select
                    dir="rtl"
                    onValueChange={(val) => {
                      // Reset the form to default values (or new values as needed)
                      form.reset({
                        ...defaultClassroomValues,
                        depart_id: Number(val),
                      });
                      // Reset all related local state
                      setDepartId(Number(val));
                      setProgramId(0);
                      setReqId(0);
                      setSelectedTeacher([]);
                      setSelectedSubject([]);
                      setSelectedReq([]);
                      setSelectedProgram([]);
                    }}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : field.value.toString()
                    }
                    defaultValue={undefined}
                  >
                    <SelectTrigger dir="rtl" className="w-full">
                      <SelectValue
                        placeholder={pageData.departField.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departs.map((t) => (
                        <SelectItem
                          key={t.id || 0}
                          value={t.id?.toString() || "0"}
                        >
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedTeacher.length != 0 && (
            <FormField
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <FormItem
                  style={{
                    gridTemplateRows: "30px 1fr 1fr",
                  }}
                >
                  <FormLabel>{pageData.teacherField.label}</FormLabel>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={(val) => field.onChange(val)}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={undefined}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.teacherField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTeacher.map((t) => (
                          <SelectItem
                            key={t.id || 0}
                            value={t.id?.toString() || "0"}
                          >
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedProgram.length != 0 && (
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem
                  style={{
                    gridTemplateRows: "30px 1fr 1fr",
                  }}
                >
                  <FormLabel>{pageData.programField.label}</FormLabel>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={(val) => {
                        // Reset the form to default values (or new values as needed)
                      form.reset({
                        ...defaultClassroomValues,
                        depart_id: departId,
                        teacher_id: form.getValues('teacher_id'),
                        program_id: Number(val)
                      });
                      // Reset all related local state
                      setProgramId(Number(val));
                      setReqId(0);
                      setSelectedSubject([]);
                      }}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={undefined}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.programField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProgram.map((t) => (
                          <SelectItem
                            key={t.id || 0}
                            value={t.id?.toString() || "0"}
                          >
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedReq.length != 0 && (
            <FormField
              control={form.control}
              name="req_id"
              render={({ field }) => (
                <FormItem
                  style={{
                    gridTemplateRows: "30px 1fr 1fr",
                  }}
                >
                  <FormLabel>{pageData.reqField.label}</FormLabel>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={(val) => {
                          // Reset the form to default values (or new values as needed)
                      form.reset({
                        ...defaultClassroomValues,
                        depart_id: departId,
                        teacher_id: form.getValues('teacher_id'),
                        program_id: programId,
                        req_id: Number(val)
                      });
                      // Reset all related local state
                      setReqId(Number(val));
                      }}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={undefined}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.reqField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedReq.map((t) => (
                          <SelectItem
                            key={t.id || 0}
                            value={t.id?.toString() || "0"}
                          >
                            {`${t.name} - ${t.type}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedSubject.length != 0 && (
            <FormField
              control={form.control}
              name="subject_id"
              render={({ field }) => (
                <FormItem
                  style={{
                    gridTemplateRows: "30px 1fr 1fr",
                  }}
                >
                  <FormLabel>{pageData.subjectField.label}</FormLabel>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={(val) => field.onChange(val)}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={undefined}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.subjectField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSubject.map((t) => (
                          <SelectItem
                            key={t.id || 0}
                            value={t.id?.toString() || "0"}
                          >
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "تحديث البيانات" : "تسكين مقرر"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
