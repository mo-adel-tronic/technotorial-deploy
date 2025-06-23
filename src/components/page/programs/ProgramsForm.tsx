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
import { useRevalidate } from "@/hooks/revalidate";
import { RevalidateKey } from "@/constants/RevalidateKey";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  defaultProgramsValues,
  ProgramsFormValues,
  ProgramsSchema,
} from "@/features/programs/ProgramsRules";
import { addPrograms, updatePrograms } from "@/features/programs/ProgramsRepo";
import { fetchAllDepartments } from "@/features/department/DepartmentRepo";

interface ProgramsFormProps {
  defaultValues?: Partial<ProgramsFormValues>;
  isEditMode?: boolean;
  id?: number;
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  nameField: {
    label: "اسم البرنامج",
    placeholder: "أدخل اسم البرنامج الدراسي",
  },
  codeField: {
    label: "كود البرنامج",
    placeholder: "أدخل كود البرنامج الدراسي",
    desc: "سوف يتم استخدام الكود في تكوين كود المقرر",
  },
  paperField: {
    label: "عدد ساعات الرسالة",
    placeholder: "حدد عدد ساعات الرسالة",
    desc: "إذا لم يكن هناك رسالة في هذا البرنامج، اترك القيمة صفر",
  },
  subjectField: {
    label: "عدد ساعات المقررات",
    placeholder: "حدد عدد ساعات المقررات لهذا البرنامج",
    desc: "إذا لم يكن هناك رسالة في هذا البرنامج، اترك القيمة صفر",
  },
  departField: {
    label: "اختر القسم التابع له البرنامج",
    placeholder: "اختر القسم",
  },
};
export default function ProgramForm({
  defaultValues = defaultProgramsValues,
  isEditMode = false,
  id = 0,
}: ProgramsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProgramsFormValues>({
    resolver: zodResolver(ProgramsSchema),
    defaultValues,
  });
  const { revalidate } = useRevalidate();
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  async function onSubmit(data: ProgramsFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updatePrograms({
          name: data.name,
          depart_id: Number(data.depart_id),
          paper_hours: data.paper_hours,
          subject_hours: data.subject_hours,
          program_code: data.program_code,
          id: id,
        });
      } else {
        res = await addPrograms({
          name: data.name,
          depart_id: Number(data.depart_id),
          paper_hours: data.paper_hours,
          subject_hours: data.subject_hours,
          program_code: data.program_code,
        });
      }
      await revalidate(RevalidateKey.AllPrograms, RevalidateKey.AllPrograms);
      if (!isEditMode) {
        router.push(RoutesName.PROGRAMS);
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode
            ? `تم تعديل بيانات البرنامج بنجاح`
            : `تم إضافة برنامج جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات البرنامج"
            : "هناك مشكلة في تسجيل البرنامج الجديد"
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(pageData.requestError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getDeparts = async () => {
    const res = await fetchAllDepartments();
    setDeparts(
      res
        ? res.map((d) => ({
            id: d.id ?? 0,
            name: d.name,
          }))
        : []
    );
  };

  const [departs, setDeparts] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    getDeparts();
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 font-madani"
      >
        <div className="flex flex-wrap *:w-2/5 gap-x-8">
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
            name="program_code"
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
                <FormDescription>{pageData.codeField.desc}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paper_hours"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.paperField.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.paperField.placeholder}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormDescription>{pageData.paperField.desc}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject_hours"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.subjectField.label}</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    type="number"
                    placeholder={pageData.subjectField.placeholder}
                  />
                </FormControl>
                <FormDescription>{pageData.subjectField.desc}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value === undefined || field.value === null ? "" : String(field.value)}
                    defaultValue={undefined}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={pageData.departField.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departs.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "تحديث البيانات" : "إضافة برنامج"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
