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
import {
  defaultDepartmentValues,
  DepartmentFormValues,
  DepartmentSchema,
} from "@/features/department/DepartmentRules";
import { RoutesName } from "@/constants/RoutesName";
import {
  addDepartment,
  updateDepartment,
} from "@/features/department/DepartmentRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { RevalidateKey } from "@/constants/RevalidateKey";

interface DepartmentFormProps {
  defaultValues?: Partial<DepartmentFormValues>;
  isEditMode?: boolean;
  id?: number;
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  nameField: {
    label: "اسم القسم",
    placeholder: "أدخل اسم القسم",
  },
  codeField: {
    label: "كود القسم",
    placeholder: "أدخل كود القسم",
    desc: "سيتم استخدام كود القسم في تكوين كود المقررات. مثال كود القسم: ET",
  },
};
export default function DepartmentForm({
  defaultValues = defaultDepartmentValues,
  isEditMode = false,
  id = 0,
}: DepartmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues,
  });
  const { revalidate } = useRevalidate();
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  async function onSubmit(data: DepartmentFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updateDepartment({
          name: data.name,
          depart_code: data.depart_code,
          id: id,
        });
      } else {
        res = await addDepartment(data);
      }
      await revalidate(
        RevalidateKey.AllDepartment,
        RevalidateKey.AllDepartment
      );
      if (!isEditMode) {
        router.push(RoutesName.DEPARTMENT);
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode ? `تم تعديل بيانات القسم بنجاح` : `تم إضافة قسم جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات القسم"
            : "هناك مشكلة في تسجيل القسم الجديد"
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
            name="depart_code"
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
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "تحديث البيانات" : "إضافة قسم"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
