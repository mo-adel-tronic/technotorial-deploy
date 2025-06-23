"use client";

import { Button } from "@/components/ui/button";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { StudentStatus, studentStatusCases, StudentStatusCases } from "@/db/types";
import { addResearchStatus, deleteResearchStatus, fetchResearcherStatus, updateResearchStatus } from "@/features/researchers/ResearcherRepo";
import { useFieldGen } from "@/hooks/FieldGen";
import { useRevalidate } from "@/hooks/revalidate";
import { ChevronDown, Edit, Plus, Save, Trash, X } from "lucide-react";
import { useState } from "react";

/**
 * ! **************** Types ***********************
 */
interface StatusItem extends StudentStatus {
  isEditing: boolean;
  isNew: boolean;
}
interface Props {
  researchid: number;
}

/**
 * ! **************** Component ***********************
 */
export default function ResearcherStatusFields({ researchid }: Props) {
  /**
   * ! **************** States ***********************
   */
  const [currentObj, setCurrentObj] = useState<StatusItem | null>(null);
  const { revalidate } = useRevalidate();
  /**
   * ! **************** field generator ***********************
   */
  const {
    field,
    saveField,
    cancelEdit,
    editField,
    removeField,
    addField,
    isAdding,
  } = useFieldGen<StatusItem, StudentStatus>(async () => {
    const res = await fetchResearcherStatus(Number(researchid));
    return res;
  });

  /**
   * ! **************** Return Component ***********************
   */
  return (
    <>
      {field &&
        field.map((sp) => (
          <div
            className="flex items-center justify-between gap-2 bg-app-background py-2 px-3 shadow-lg w-4/5 font-bold"
            key={sp.id}
          >
            {/* Edit Mode */}
            {sp.isEditing ? (
              <>
                {/* Right side [Select inputs] */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select
                      value={currentObj ? (currentObj.name ?? "اختر حالة الباحث") : sp.name}
                      onChange={(e) => {
                        if (currentObj)
                          setCurrentObj({
                            ...currentObj,
                            name: e.target.value as StudentStatusCases,
                          });
                      }}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 px-3 pr-8 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    >
                      <option value="اختر حالة الباحث" disabled>
                        اختر الحالة
                      </option>
                      {studentStatusCases.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                {/* Left Side [buttons] */}
                <div>
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => {
                      saveField({
                        id: Number(sp.id),
                        values: [
                          {
                            type: "o",
                            k: "id",
                            arK: "معرف الحالة",
                            v: String(sp.id),
                          },
                          {
                            type: "r",
                            k: "name",
                            arK: "الحالة",
                            v: currentObj?.name || sp.name || '',
                          },
                          {
                            type: "r",
                            k: "student_id",
                            arK: "رقم معرف الباحث",
                            v: String(researchid),
                          }
                        ],
                        onCreate: async (data) => {
                          const res = await addResearchStatus({
                            name: data.name,
                            student_id: data.student_id
                          });
                          await revalidate(
                            RevalidateKey.AllResearchers,
                            RevalidateKey.AllResearchers
                          );
                          await revalidate(
                            RevalidateKey.AllResearchersDetails,
                            RevalidateKey.AllResearchersDetails
                          );
                          return res;
                        },
                        onUpdate: async (data) => {
                          const res = await updateResearchStatus(data);
                          await revalidate(
                            RevalidateKey.AllResearchers,
                            RevalidateKey.AllResearchers
                          );
                          await revalidate(
                            RevalidateKey.AllResearchersDetails,
                            RevalidateKey.AllResearchersDetails
                          );
                          return res;
                        },
                      });
                      setCurrentObj(null);
                    }}
                  >
                    <Save className="h-4 w-4 ml-1 text-green-500" />
                    حفظ
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      cancelEdit(Number(sp.id ?? ""), sp.isNew);
                      setCurrentObj(null);
                    }}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </>
            ) : (
              // ******** View Mode
              <>
                <div className="flex-1">{sp.name}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    editField(Number(sp.id ?? ""));
                    setCurrentObj(sp);
                  }}
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() =>
                    removeField({
                      id: Number(sp.id ?? ""),
                      onDelete: (v: number) => {
                        return deleteResearchStatus(v);
                      },
                    })
                  }
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
          const c: StatusItem = {
            id: -1,
            name: undefined,
            student_id: researchid,
            isEditing: true,
            isNew: true,
          };
          addField(c);
          setCurrentObj(c);
        }}
        disabled={isAdding}
      >
        <Plus className="h-4 w-4 ml-1" />
        إضافة حالة
      </Button>
    </>
  );
}
