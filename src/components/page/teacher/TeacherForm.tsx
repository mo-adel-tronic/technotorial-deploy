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
  AllowedTeacherDegree,
  defaultTeacherValues,
  TeacherFormValues,
  TeacherSchema,
} from "@/features/teachers/TeacherRules";
import { addTeacher, updateTeacher } from "@/features/teachers/TeacherRepo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeacherFormProps {
  defaultValues?: Partial<TeacherFormValues>;
  isEditMode?: boolean;
  id?: number;
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  nameField: {
    label: "اسم العضو",
    placeholder: "أدخل اسم عضو هيئة التدريس",
  },
  emailField: {
    label: "البريد الإلكتروني",
    placeholder: "أدخل البريد الإلكتروني الرسمي",
    desc: "يجب أن يكون البريد الإلكتروني ضمن نطاق @sedu.asu.edu.eg",
  },
  degreeField: {
    label: "الدرجة",
    placeholder: "اختر الدرجة العلمية",
  },
  orderField: {
    label: "رقم الأقدمية",
    placeholder: 'أدخل رقم أقدمية للعضو',
    desc: 'يجب أن يكون الرقم فريد غير مستخدم لعضو أخر',
  },
};
export default function TeacherForm({
  defaultValues = defaultTeacherValues,
  isEditMode = false,
  id = 0,
}: TeacherFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(TeacherSchema),
    defaultValues,
  });
  const { revalidate } = useRevalidate();
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  async function onSubmit(data: TeacherFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
      success: boolean;
    };
      if (isEditMode) {
        res = await updateTeacher({
          name: data.name,
          degree: data.degree,
          email: data.email,
          t_order: Number(data.t_order),
          id: id,
        });
      } else {
        res = await addTeacher({
          name: data.name,
          degree: data.degree,
          email: data.email,
          t_order: Number(data.t_order)
        });
      }
      await revalidate(RevalidateKey.AllTeachers, RevalidateKey.AllTeachers);
      if (!isEditMode) {
        router.push(RoutesName.TEACHER);
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode ? `تم تعديل بيانات العضو بنجاح` : `تم إضافة عضو جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات العضو"
            : "هناك مشكلة في تسجيل العضو الجديد"
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
            name="email"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.emailField.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={pageData.emailField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{pageData.emailField.desc}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.degreeField.label}</FormLabel>
                <FormControl>
                    <Select
                    dir="rtl"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                    <SelectTrigger>
                      <SelectValue placeholder={pageData.degreeField.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {AllowedTeacherDegree.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="t_order"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.orderField.label}</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                    placeholder={pageData.orderField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{pageData.orderField.desc}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "تحديث البيانات" : "إضافة عضو"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
