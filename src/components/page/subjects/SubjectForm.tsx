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
import { defaultSubjectsValues, SubjectsFormValues, SubjectsSchema } from "@/features/subjects/SubjectRules";
import { addSubject, updateSubject } from "@/features/subjects/SubjectRepo";

interface SubjectsFormProps {
  defaultValues?: Partial<SubjectsFormValues>;
  isEditMode?: boolean;
  id?: number;
  require_id: number;
  program_id: number;
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  nameField: {
    label: "اسم المقرر",
    placeholder: "أدخل اسم المقرر الدراسي",
  },
  codeField: {
    label: "كود المقرر",
    placeholder: "أدخل كود المقرر الدراسي"
  },
  theoretical_hour: {
    label: "عدد ساعات النظري",
    placeholder: "حدد عدد ساعات النظري"
  },
  practical_hour: {
    label: "عدد ساعات العملي",
    placeholder: "حدد عدد ساعات العملي"
  },
  credit_hour: {
    label: "عدد الساعات المعتمدة",
    placeholder: "حدد عدد ساعات المقرر المعتمدة"
  },
  theoretical_exam_duration: {
    label: "مدة امتحان النظري (دقيقة)",
    placeholder: "حدد مدة امتحان النظري"
  },
  practical_exam_duration: {
    label: "مدة امتحان العملي (دقيقة)",
    placeholder: "حدد مدة امتحان العملي"
  },
  theoretical_degree: {
    label: "درجة النظري",
    placeholder: "حدد درجة النظري"
  },
  practical_degree: {
    label: "درجة العملي",
    placeholder: "حدد درجة العملي"
  },
  activity_degree: {
    label: "درجة أعمال السنة",
    placeholder: "حدد درجة أعمال السنة"
  },
};
export default function SubjectForm({
  defaultValues = defaultSubjectsValues,
  isEditMode = false,
  id = 0,
  require_id,
  program_id
}: SubjectsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SubjectsFormValues>({
    resolver: zodResolver(SubjectsSchema),
    defaultValues,
  });
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  useEffect(() => {
    console.log("Form errors", form.formState.errors);
  }, [form.formState.errors]);
  async function onSubmit(data: SubjectsFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updateSubject({
          name: data.name,
          subject_code: data.subject_code,
          theoretical_hour: data.theoretical_hour,
          practical_hour: data.practical_hour,
          credit_hour: data.credit_hour,
          theoretical_exam_duration: data.theoretical_exam_duration,
          practical_exam_duration: data.practical_exam_duration,
          theoretical_degree: data.theoretical_degree,
          practical_degree: data.practical_degree,
          activity_degree: data.activity_degree,
          require_id: require_id,
          id: id,
        });
      } else {
        res = await addSubject({
          name: data.name,
          subject_code: data.subject_code,
          theoretical_hour: data.theoretical_hour,
          practical_hour: data.practical_hour,
          credit_hour: data.credit_hour,
          theoretical_exam_duration: data.theoretical_exam_duration,
          practical_exam_duration: data.practical_exam_duration,
          theoretical_degree: data.theoretical_degree,
          practical_degree: data.practical_degree,
          activity_degree: data.activity_degree,
          require_id: require_id,
        });
      }
      console.log(res);
      if (!isEditMode) {
        router.push(RoutesName.PROGRAMS + '/' + program_id.toString() + RoutesName.REQUIREMENTS + '/' + require_id.toString());
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode
            ? `تم تعديل بيانات المقرر بنجاح`
            : `تم إضافة مقرر جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات المقرر"
            : "هناك مشكلة في تسجيل المقرر الجديد"
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
            name="subject_code"
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
            name="theoretical_hour"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.theoretical_hour.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.theoretical_hour.placeholder}
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
            name="practical_hour"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.practical_hour.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.practical_hour.placeholder}
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
            name="credit_hour"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.credit_hour.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.credit_hour.placeholder}
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
            name="theoretical_exam_duration"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.theoretical_exam_duration.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.theoretical_exam_duration.placeholder}
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
            name="practical_exam_duration"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.practical_exam_duration.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.practical_exam_duration.placeholder}
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
            name="theoretical_degree"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.theoretical_degree.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.theoretical_degree.placeholder}
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
            name="practical_degree"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.practical_degree.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.practical_degree.placeholder}
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
            name="activity_degree"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.activity_degree.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.activity_degree.placeholder}
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

        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "تحديث البيانات" : "إضافة مقرر"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
