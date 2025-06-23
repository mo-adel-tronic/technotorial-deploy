"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Specialization as SpecType } from "@/db/types";
import {
  addSpecialization,
  deleteSpecialization,
  fetchSpecialization,
  updateSpecialization,
} from "@/features/department/SpecializationRepo";
import { useFieldGen } from "@/hooks/FieldGen";
import { Edit, Plus, Save, Trash, X } from "lucide-react";

/**
 * ! **************** Types ***********************
 */
interface SpecItem extends SpecType {
  isEditing: boolean;
  isNew: boolean;
}
interface Props {
  departId: number;
}

/**
 * ! **************** Component ***********************
 */
export default function Specialization({ departId }: Props) {
  const {
    field,
    saveField,
    cancelEdit,
    editField,
    removeField,
    addField,
    isAdding,
  } = useFieldGen<SpecItem, SpecType>(async () => {
    const res = await fetchSpecialization(departId);
    return res;
  });
  return (
    <>
      {field &&
        field.map((sp) => (
          <div className="flex items-center gap-2 bg-app-background py-2 px-3 shadow-lg w-3/5 font-bold" key={sp.id}>
            {sp.isEditing ? (
              <>
                <Input
                  defaultValue={sp.name}
                  placeholder="ادخل اسم التخصص"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveField({
                        id: Number(sp.id),
                        values: [
                          {
                            type: "r",
                            k: "name",
                            arK: "اسم التخصص",
                            v: e.currentTarget.value,
                          },
                          {
                            type: "o",
                            k: "id",
                            arK: "رقم المعرف",
                            v: String(sp.id),
                          },
                          {
                            type: "o",
                            k: "depart_id",
                            arK: "رقم معرف القسم",
                            v: String(sp.depart_id),
                          },
                        ],
                        onCreate: async (data) => {
                          const res = await addSpecialization({
                            name: data.name,
                            depart_id: departId,
                          });
                          return res;
                        },
                        onUpdate: async (data) => {
                          const res = await updateSpecialization(data);
                          return res;
                        },
                      });
                    }
                  }}
                />
                <Button
                  size={"sm"}
                  variant={"outline"}
                  onClick={(e) => {
                    // Get the input value from the previous sibling
                    const input = e.currentTarget
                      .previousSibling as HTMLInputElement;
                    saveField({
                      id: Number(sp.id),
                      values: [
                        {
                          type: "r",
                          k: "name",
                          arK: "اسم التخصص",
                          v: input.value,
                        },
                        {
                            type: "o",
                            k: "id",
                            arK: "رقم المعرف",
                            v: String(sp.id),
                          },
                          {
                            type: "o",
                            k: "depart_id",
                            arK: "رقم معرف القسم",
                            v: String(sp.depart_id),
                          },
                      ],
                      onCreate: async (data) => {
                        const res = await addSpecialization({
                          name: data.name,
                          depart_id: departId,
                        });
                        return res;
                      },
                      onUpdate: async (data) => {
                        const res = await updateSpecialization(data);
                        return res;
                      },
                    });
                  }}
                >
                  <Save className="h-4 w-4 ml-1 text-green-500" />
                  حفظ
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => cancelEdit(Number(sp.id ?? ""), sp.isNew)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1">{sp.name}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => editField(Number(sp.id ?? ""))}
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => removeField({id: Number(sp.id ?? ""), onDelete: (v: number) => {
                    return deleteSpecialization(v)
                  }})}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      <Button
        className="mt-2 font-bold"
        onClick={() => {
          addField({
            id: -1,
            name: "",
            depart_id: departId,
            isEditing: true,
            isNew: true,
          });
        }}
        disabled={isAdding}
      >
        <Plus className="h-4 w-4 ml-1" />
        إضافة تخصص
      </Button>
    </>
  );
}
