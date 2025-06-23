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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AllowedRequirementTypes, defaultRequirementsValues, RequirementsFormValues, RequirementsSchema } from "@/features/requirements/RequirementRules";
import { addRequirements, updateRequirements } from "@/features/requirements/RequirementRepo";

interface RequirementsFormProps {
  defaultValues?: Partial<RequirementsFormValues>;
  isEditMode?: boolean;
  id?: number;
  program_id: number
}
const pageData = {
  requestError: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  nameField: {
    label: "اسم المتطلب",
    placeholder: "أدخل اسم المتطلب الدراسي",
  },
  codeField: {
    label: "كود المتطلب",
    placeholder: "أدخل كود المتطلب الدراسي",
    desc: "سوف يتم استخدام الكود في تكوين كود المقرر",
  },
  creditField: {
    label: "عدد ساعات المتطلب",
    placeholder: "حدد عدد ساعات المتطلب"
  },
  typeField: {
    label: "حدد حالة المتطلب",
    placeholder: "حالة المتطلب",
  },
};
export default function RequirementForm({
  defaultValues = defaultRequirementsValues,
  isEditMode = false,
  id = 0,
  program_id
}: RequirementsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RequirementsFormValues>({
    resolver: zodResolver(RequirementsSchema),
    defaultValues,
  });
  useEffect(() => {
    if (typeof error == "string") {
      toast.error(error);
    }
  }, [error]);
  async function onSubmit(data: RequirementsFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      let res: {
        success: boolean;
      };
      if (isEditMode) {
        res = await updateRequirements({
          name: data.name,
          type: data.type,
          credit_hour: data.credit_hour,
          require_code: data.require_code,
          program_id: program_id,
          id: id,
        });
      } else {
        res = await addRequirements({
          name: data.name,
          type: data.type,
          credit_hour: data.credit_hour,
          require_code: data.require_code,
          program_id: program_id,
        });
      }
      if (!isEditMode) {
        router.push(RoutesName.PROGRAMS + '/' + program_id.toString());
      }
      router.refresh();
      if (res.success) {
        toast.success(
          isEditMode
            ? `تم تعديل بيانات المتطلب بنجاح`
            : `تم إضافة متطلب جديد بنجاح`
        );
      } else {
        toast.error(
          isEditMode
            ? "هناك مشكلة في تعديل بيانات المتطلب"
            : "هناك مشكلة في تسجيل المتطلب الجديد"
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
            name="require_code"
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
            name="credit_hour"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.creditField.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={pageData.creditField.placeholder}
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
            name="type"
            render={({ field }) => (
              <FormItem
                style={{
                  gridTemplateRows: "30px 1fr 1fr",
                }}
              >
                <FormLabel>{pageData.typeField.label}</FormLabel>
                <FormControl>
                  <Select
                    dir="rtl"
                    onValueChange={(val) => field.onChange(val)}
                    value={field.value === undefined || field.value === null ? "" : field.value}
                    defaultValue={undefined}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={pageData.typeField.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {AllowedRequirementTypes.map((t) => (
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
            {isEditMode ? "تحديث البيانات" : "إضافة متطلب"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
