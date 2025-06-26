"use client";

import { Button } from "@/components/ui/button";
import { JobsType } from "@/db/types";
import { fetchAllDepartments } from "@/features/department/DepartmentRepo";
import { AllowedTeacherJobs } from "@/features/teachers/TeacherJobRules";
import {
  addTeacherJob,
  deleteTeacherJob,
  fetchJobs,
  updateTeacherJob,
} from "@/features/teachers/TeacherJobsRepo";
import { JobsWithDepartment } from "@/features/teachers/types";
import { useFieldGen } from "@/hooks/FieldGen";
import { ChevronDown, Edit, Plus, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * ! **************** Types ***********************
 */
interface JobItem extends JobsWithDepartment {
  isEditing: boolean;
  isNew: boolean;
}
interface Props {
  teacherId: number;
}

/**
 * ! **************** Component ***********************
 */
export default function TeacherJobsFields({ teacherId }: Props) {
  /**
   * ! **************** States ***********************
   */
  const [currentObj, setCurrentObj] = useState<JobItem | null>(null);
  const [depart, setDepart] = useState<{ id: number; name: string }[]>([]);
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
  } = useFieldGen<JobItem, JobsWithDepartment>(async () => {
    const res = await fetchJobs(teacherId);
    return res;
  });
  /**
   * ! **************** get all Departments ***********************
   */
  const getDepart = async () => {
    const res = await fetchAllDepartments();
    setDepart(res ? res.map((d) => ({ id: d.id ?? 0, name: d.name })) : []);
  };
  useEffect(() => {
    getDepart();
  }, []);

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
                  {/* First Select */}
                  <div className="relative">
                    <select
                      id="teacherJobTitle"
                      value={currentObj ? (currentObj.job ?? "اختر وظيفة العضو") : sp.job}
                      onChange={(e) => {
                        if (currentObj)
                          setCurrentObj({
                            ...currentObj,
                            job: e.target.value as JobsType,
                          });
                      }}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 px-3 pr-8 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    >
                      <option value="اختر وظيفة العضو" disabled>
                        اختر الوظيفة
                      </option>
                      {AllowedTeacherJobs.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  {/* Second Select */}
                  <div className="relative">
                    <select
                      id="teacherJob"
                      value={
                        currentObj ? (currentObj.departName ? `${currentObj.depart_id}|${currentObj.departName}` : "اختر القسم"): `${sp.depart_id}|${sp.departName}`
                      }
                      onChange={(e) => {
                        if (currentObj)
                          setCurrentObj({
                            ...currentObj,
                            departName: e.target.value.split("|")[1],
                            depart_id: Number(e.target.value.split("|")[0]),
                          });
                      }}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 px-3 pr-8 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    >
                      <option value="اختر القسم" disabled>
                        اختر القسم
                      </option>
                      {depart.map((j) => (
                        <option key={j.id} value={`${j.id}|${j.name}`}>
                          {j.name}
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
                            arK: "معرف الوظيفة",
                            v: String(sp.id),
                          },
                          {
                            type: "r",
                            k: "job",
                            arK: "الوظيفة",
                            v: currentObj?.job || (sp.job ?? ''),
                          },
                          {
                            type: "r",
                            k: "teacher_id",
                            arK: "رقم معرف عضو هيئة التدريس",
                            v: String(teacherId),
                          },
                          {
                            type: "r",
                            k: "depart_id",
                            arK: "رقم معرف القسم",
                            v: String(currentObj?.depart_id),
                          },
                          {
                            type: "r",
                            k: "departName",
                            arK: "اسم القسم",
                            v: String(currentObj?.departName),
                          },
                        ],
                        onCreate: async (data) => {
                          if(data.job) {
                            const res = await addTeacherJob({
                              job: data.job,
                              depart_id: data.depart_id,
                              teacher_id: data.teacher_id,
                            });
                            return res;
                          } else {
                            toast.error('لم يتم تحديد الوظيفة');
                            return {
                              success: false,
                              id: 0,
                              rowInserted: 0
                          }
                          }
                        },
                        onUpdate: async (data) => {
                          if(data.job) {
                            const res = await updateTeacherJob({
                              id: data.id,
                              job: data.job,
                              depart_id: data.depart_id,
                              teacher_id: data.teacher_id
                            });
                            return res;
                          } else {
                            toast.error('لم يتم تحديد الوظيفة');
                            return {
                              success: false,
                              rowChanged: 0
                          }
                          }
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
                <div className="flex-1">{sp.job}</div>
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
                        return deleteTeacherJob(v);
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
          const c: JobItem = {
            id: -1,
            job: undefined,
            depart_id: 0,
            departName: "",
            teacher_id: teacherId,
            isEditing: true,
            isNew: true,
          };
          addField(c);
          setCurrentObj(c);
        }}
        disabled={isAdding}
      >
        <Plus className="h-4 w-4 ml-1" />
        إضافة وظيفة
      </Button>
    </>
  );
}
