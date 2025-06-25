"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RoutesName } from "@/constants/RoutesName";
import { fetchAllDepartments } from "@/features/department/DepartmentRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { RevalidateKey } from "@/constants/RevalidateKey";
import {
  defaultResearcherValues,
  ResearcherFormValues,
  ResearcherSchema,
} from "@/features/researchers/ResearcherRules";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department, Programs, Specialization, Teacher } from "@/db/types";
import { fetchSpecialization } from "@/features/department/SpecializationRepo";
import { fetchProgramsById } from "@/features/programs/ProgramsRepo";
import { getDepartTeachers } from "@/features/teachers/TeacherRepo";
import {
  addResearcher,
  updateResearcher,
} from "@/features/researchers/ResearcherRepo";

interface ResearcherFormProps {
  defaultValues?: Partial<ResearcherFormValues>;
  isEditMode?: boolean;
  id?: number;
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  nameField: {
    label: "اسم الباحث",
    placeholder: "أدخل اسم الباحث",
  },
  codeField: {
    label: "كود الباحث",
    placeholder: "أدخل كود الباحث",
  },
  registeredField: {
    label: "تاريخ القيد",
    placeholder: "ادخل تاريخ القيد بالدرسات العليا",
  },
  nationalNumberField: {
    label: "الرقم القومي",
    placeholder: "ادخل الرقم القومي",
    desc: "يتم ادخال الرقم القومي 14 رقم المسجل في البطاقة أو الرقم القومي المسجل في جواز السفر في حالة الوافدين",
  },
  phoneNumberField: {
    label: "رقم الهاتف المحلي",
    placeholder: "ادخل رقم الهاتف المكون من 11 رقم",
    desc: "هذا الرقم مكون من 11 رقم يبدأ ب 01",
  },
  nationalPhoneField: {
    label: "رقم الهاتف الدولي",
    placeholder: "ادخل رقم الهاتف الدولي",
    desc: "يتم ملئ هذا الحقل في حالة الوافدين فقط",
  },
  departField: {
    label: "القسم العلمي التابع له",
    placeholder: "حدد القسم العملي",
  },
  specField: {
    label: "التخصص",
    placeholder: "حدد التخصص",
  },
  programField: {
    label: "البرنامج",
    placeholder: "حدد البرنامج",
  },
  advisorField: {
    label: "المرشد الأكاديمي",
    placeholder: "حدد المرشد الأكاديمي",
  },
};
export default function ResearcherForm({
  defaultValues = defaultResearcherValues,
  isEditMode = false,
  id = 0,
}: ResearcherFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departState, setDepartState] = useState<Department[]>([]);
  const [departId, setDepartId] = useState<number>(0);
  const [spectState, setSpectState] = useState<Specialization[]>([]);
  const [programState, setProgramState] = useState<Programs[]>([]);
  const [advisorState, setAdvisorState] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ResearcherFormValues>({
    resolver: zodResolver(ResearcherSchema) as any,
    defaultValues: defaultValues as ResearcherFormValues,
  });
  const { revalidate } = useRevalidate();
  const departs = async (): Promise<Department[]> => {
    const d = await fetchAllDepartments();
    return d ?? [];
  };
  const spects = async (): Promise<Specialization[]> => {
    const d = await fetchSpecialization(departId);
    return d ?? [];
  };
  const progs = async (): Promise<Programs[]> => {
    const d = await fetchProgramsById(departId);
    return d ?? [];
  };
  const teachers = async (): Promise<Teacher[]> => {
    const d = await getDepartTeachers(departId, ["مرشد أكاديمي"]);
    return d ?? [];
  };
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  useEffect(() => {
    departs().then((v) => setDepartState(v));
    if(isEditMode && defaultValues.department) {
        setDepartId(defaultValues.department)
    }   
  }, []);
  useEffect(() => {
    if (departId) {
      spects().then((v) => setSpectState(v));
      progs().then((v) => setProgramState(v));
      teachers().then((v) => setAdvisorState(v));
    }
  }, [departId]);

  async function onSubmit(data: ResearcherFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updateResearcher({
          name: data.name,
          registered_at: data.registered_at || undefined,
          student_code: data.student_code,
          national_n: data.national_n,
          phone: data.phone ?? undefined,
          nation_phone: data.nation_phone ?? undefined,
          advisor: data.advisor ?? undefined,
          specialization_id: data.specialization_id,
          program_id: data.program_id,
          id: id,
        });
      } else {
        res = await addResearcher({
          name: data.name,
          registered_at: data.registered_at || undefined,
          student_code: data.student_code,
          national_n: data.national_n,
          phone: data.phone ?? undefined,
          nation_phone: data.nation_phone ?? undefined,
          advisor: data.advisor ?? undefined,
          specialization_id: data.specialization_id,
          program_id: data.program_id,
        });
      }
      await revalidate(
        RevalidateKey.AllResearchers,
        RevalidateKey.AllResearchers
      );
      await revalidate(
        RevalidateKey.AllResearchersDetails,
        RevalidateKey.AllResearchersDetails
      );
      if (!isEditMode) {
        router.push(RoutesName.RESEARCHERS);
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode
            ? `تم تعديل بيانات الباحث بنجاح`
            : `تم إضافة باحث جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات الباحث"
            : "هناك مشكلة في تسجيل الباحث الجديد"
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
            name="name"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.nameField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.nameField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_code"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.codeField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.codeField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registered_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{pageData.registeredField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.registeredField.placeholder}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="national_n"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.nationalNumberField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.nationalNumberField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {pageData.nationalNumberField.desc}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.phoneNumberField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.phoneNumberField.placeholder}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  {pageData.phoneNumberField.desc}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nation_phone"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.nationalPhoneField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.nationalPhoneField.placeholder}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  {pageData.nationalPhoneField.desc}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
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
                      field.onChange(val);
                      setDepartId(Number(val));
                    }}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : field.value.toString()
                    }
                    defaultValue={"0"}
                  >
                    <SelectTrigger dir="rtl" className="w-full">
                      <SelectValue
                        placeholder={pageData.departField.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departState.map((t) => (
                        <SelectItem key={t.id} value={t.id?.toString() || "0"}>
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
          {spectState.length != 0 && (
            <FormField
              control={form.control}
              name="specialization_id"
              render={({ field }) => (
                <FormItem
                  style={{
                    gridTemplateRows: "30px 1fr 1fr",
                  }}
                >
                  <FormLabel>{pageData.specField.label}</FormLabel>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={(val) => field.onChange(val)}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={"0"}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.specField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {spectState.map((t) => (
                          <SelectItem
                            key={t.id}
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
          {programState.length != 0 && (
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
                      onValueChange={(val) => field.onChange(val)}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={"0"}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.programField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {programState.map((t) => (
                          <SelectItem
                            key={t.id}
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
          {advisorState.length != 0 && (
            <FormField
              control={form.control}
              name="advisor"
              render={({ field }) => (
                <FormItem
                  style={{
                    gridTemplateRows: "30px 1fr 1fr",
                  }}
                >
                  <FormLabel>{pageData.advisorField.label}</FormLabel>
                  <FormControl>
                    <Select
                      dir="rtl"
                      onValueChange={(val) => field.onChange(val)}
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : field.value.toString()
                      }
                      defaultValue={"0"}
                    >
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue
                          placeholder={pageData.advisorField.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {advisorState.map((t) => (
                          <SelectItem
                            key={t.id}
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
            {isEditMode ? "تحديث البيانات" : "إضافة باحث"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
