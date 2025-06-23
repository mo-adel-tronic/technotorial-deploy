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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RoutesName } from "@/constants/RoutesName";
import { useRevalidate } from "@/hooks/revalidate";
import { RevalidateKey } from "@/constants/RevalidateKey";
import {
  defaultSemesterValues,
  SemesterFormValues,
  SemesterSchema,
} from "@/features/semesters/SemesterRules";
import { addSemester, updateSemester } from "@/features/semesters/SemesterRepo";
import { semesterTerm, SemesterTerm } from "@/db/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SemesterFormProps {
  defaultValues?: Partial<SemesterFormValues>;
  isEditMode?: boolean;
  id?: number;
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  semesterField: {
    label: "رقم المستوى",
    placeholder: "أدخل رقم المستوى",
  },
  yearField: {
    label: "العام الدراسي",
    placeholder: "أدخل العام الدراسي",
  },
  termField: {
    label: "الفصل الدراسي",
    placeholder: "أدخل الفصل الدراسي",
  },
};
export default function SemesterForm({
  defaultValues = defaultSemesterValues,
  isEditMode = false,
  id = 0,
}: SemesterFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SemesterFormValues>({
    resolver: zodResolver(SemesterSchema) as any,
    defaultValues: defaultValues as SemesterFormValues,
  });
  const { revalidate } = useRevalidate();
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  async function onSubmit(data: SemesterFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updateSemester({
          edu_year: data.edu_year,
          semester: data.semester,
          term: data.term as SemesterTerm,
          id: id,
        });
      } else {
        res = await addSemester({
          edu_year: data.edu_year,
          semester: data.semester,
          term: data.term as SemesterTerm,
        });
      }
      await revalidate(RevalidateKey.AllSemesters, RevalidateKey.AllSemesters);
      if (!isEditMode) {
        router.push(RoutesName.SEMESTERS);
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode
            ? `تم تعديل بيانات المستوى بنجاح`
            : `تم إضافة مستوى جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات المستوى"
            : "هناك مشكلة في تسجيل المستوى الجديد"
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
        <div className="flex gap-x-8 *:grow">
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.semesterField.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.semesterField.placeholder}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="edu_year"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.yearField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.yearField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.termField.label}</FormLabel>
                <FormControl>
                  <Select
                    dir="rtl"
                    onValueChange={(val) => field.onChange(val)}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : field.value
                    }
                    defaultValue={undefined}
                  >
                    <SelectTrigger dir="rtl" className="w-full">
                      <SelectValue
                        placeholder={pageData.termField.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterTerm.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
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
            {isEditMode ? "تحديث البيانات" : "إضافة مستوى"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
