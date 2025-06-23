import { useEffect, useState } from "react";
import { toast } from "sonner";

// T => used in view
// N => Native type in db
export function useFieldGen<
  T extends N & { isEditing: boolean; isNew: boolean },
  N extends { id?: number }
>(getCall: () => Promise<N[] | undefined>) {
  /**
   * ! **************** States ***********************
   */
  const [field, setField] = useState<T[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(true);

  /**
   * ! **************** Add Method ***********************
   */
  const addField = (newField: T) => {
    setField([...field, newField]);
    setIsAdding(true);
  };

  /**
   * ! **************** Remove Method ***********************
   */
  const removeField = async ({
    id,
    onDelete
  }: {
    id: number;
    onDelete?: (v: number) => Promise<{
      success: boolean;
    }>;
  }) => {
    if (id > 0 && onDelete) {
      const res = await onDelete(id);
      if (res.success) {
        setField(field.filter((f) => f.id !== Number(id)));
      } else {
        toast.error("فشل عملية حذف العنصر من قاعدة البيانات");
      }
    } else {
      setField(field.filter((f) => f.id !== Number(id)));
    }
  };

  /**
   * ! **************** Save Method ***********************
   */
  const saveField = async ({
    id,
    values,
    onCreate,
    onUpdate,
  }: {
    id: number;
    onCreate: (data: N) => Promise<{
      success: boolean;
      id?: number;
      rowInserted?: number;
    }>;
    onUpdate: (data: N) => Promise<{ success: boolean; rowChanged?: number }>;
    values: {
      type: "r" | "o"; // required | optional
      k: string;
      arK: string;
      v: string;
    }[];
  }) => {
    const nativeObj: N = {} as N;
    for (const f of values) {
      if (f.type == "r" && !f.v.trim()) {
        toast.error(`لا يمكن ترك بيانات الحقل ${f.arK} فارغ`);
        return;
      }
      (nativeObj as Record<string, any>)[f.k] = f.v;
    }
    let res:
      | { success: boolean; id?: number; rowInserted?: number }
      | { success: boolean; rowChanged?: number };
    if (id > 0) {
      res = await onUpdate(nativeObj);
    } else {
      res = await onCreate(nativeObj);
    }
    if (res && res.success) {
      let success = false;
      if ("rowInserted" in res && res.rowInserted) {
        nativeObj.id = res.id;
        success = true;
      } else if ("rowChanged" in res && res.rowChanged) {
        success = true;
      } else {
        toast.error("لا يمكن إدخال بيانات متكررة");
      }
      if (success) {
        setField(
          field.map((f) =>
            f.id == Number(id)
              ? { ...f, ...nativeObj, isEditing: false, isNew: false }
              : f
          )
        );
      }
    } else {
      toast.error(
        "rowInserted" in res
          ? "فشلت عملية الإضافة حاول مره أخرى"
          : "فشلت عملية التعديل حاول مره أخرى"
      );
    }
    setIsAdding(false);
  };

  /**
   * ! **************** Edit Method ***********************
   */
  const editField = (id: number) => {
    if (!isAdding) {
      setField(
        field.map((f) => {
          console.log(f.id, '********', id)
          return (f.id == Number(id) ? { ...f, isEditing: true } : f)
        })
      );
      setIsAdding(true);
    } else {
      toast("لا يمكن تعديل أكثر من عنصر في نفس الوقت");
    }
  };

  /**
   * ! **************** Cancel Method ***********************
   */
  const cancelEdit = (id: number, isNew: boolean) => {
    if (isNew) {
      // If it's a new language, remove it
      removeField({id});
    } else {
      // Otherwise, just cancel editing
      setField(
        field.map((f) => (f.id == Number(id) ? { ...f, isEditing: false } : f))
      );
    }
    setIsAdding(false);
  };

  /**
   * ! **************** Get data Method ***********************
   */
  const getFields = async () => {
    const res = await getCall();
    setField(
      res
        ? (res.map((f) => ({
            ...f,
            isEditing: false,
            isNew: false,
          })) as T[])
        : []
    );
  };

  useEffect(() => {
    getFields().then(() => setIsAdding(false))
  }, []);

  return {
    field,
    setField,
    saveField,
    cancelEdit,
    editField,
    removeField,
    addField,
    isAdding,
  };
}
