"use client";

import { Button } from "@/components/ui/button";
import {
  ClassroomStudentDetails,
  classroomStudentStatus,
  ClassroomStudentStatus,
  StudentSemesterListType,
} from "@/db/types";
import {
  addClassroomStudent,
  deleteClassroomStudent,
  fetchAllStudentsInClassroom,
  updateClassroomStudent,
} from "@/features/classrooms/ClassroomRepo";
import { useFieldGen } from "@/hooks/FieldGen";
import { ChevronDown, Edit, Plus, Save, Trash, X } from "lucide-react";
import {useState } from "react";
import { toast } from "sonner";

/**
 * ! **************** Types ***********************
 */
interface StudentItem extends ClassroomStudentDetails {
  isEditing: boolean;
  isNew: boolean;
}
interface Props {
  classId: number;
  studentsList: StudentSemesterListType[];
}

/**
 * ! **************** Component ***********************
 */
export default function ClassroomStudentStatusFields({
  classId,
  studentsList,
}: Props) {
  /**
   * ! **************** States ***********************
   */
  const [currentObj, setCurrentObj] = useState<StudentItem | null>(null);
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
  } = useFieldGen<StudentItem, ClassroomStudentDetails>(async () => {
    const res = await fetchAllStudentsInClassroom(classId);
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
                <div className="grid grid-cols-1 gap-3 w-full">
                  {/* First Select */}
                  <div className="relative">
                    <select
                      id="studentName"
                      value={
                        currentObj
                          ? (currentObj.student_id == 0 ? "اختر اسم الطالب" : `${currentObj.student_id}|${currentObj.studentName}`)
                          : `${sp.student_id}|${sp.studentName}`
                      }
                      onChange={(e) => {
                        if (currentObj)
                          setCurrentObj({
                            ...currentObj,
                            student_id: Number((e.target.value).split('|')[0]),
                            studentName: (e.target.value).split('|')[1]
                          });
                      }}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 px-3 pr-8 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    >
                      <option value="اختر اسم الطالب" disabled>
                        اختر الطالب
                      </option>
                      {studentsList.map((j) => (
                        <option key={j.id} value={`${j.id}|${j.name}`}>
                          {`${j.name} - (${j.status.join(" , ")})`}
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
                      id="studentStatus"
                      value={
                        currentObj
                          ? (currentObj.st_status == undefined ? "اختر نتيجة الطالب" : currentObj.st_status)
                          : sp.st_status
                      }
                      onChange={(e) => {
                        if (currentObj) {
                            setCurrentObj({
                                ...currentObj,
                                st_status: (e.target.value) as ClassroomStudentStatus,
                              });
                        }
                      }}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 px-3 pr-8 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    >
                      <option value="اختر نتيجة الطالب" disabled>
                        اختر النتيجة
                      </option>
                      {classroomStudentStatus.map((j) => (
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
                <div className="flex">
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
                            arK: "المعرف",
                            v: String(sp.id),
                          },
                          {
                            type: "r",
                            k: "studentName",
                            arK: "اسم الطالب",
                            v: currentObj?.studentName || sp.studentName,
                          },
                          {
                            type: "r",
                            k: "student_id",
                            arK: "رقم معرف الطالب",
                            v: String(currentObj?.student_id),
                          },
                          {
                            type: "r",
                            k: "st_status",
                            arK: "نتيجة الطالب",
                            v: String(currentObj?.st_status),
                          },
                        ],
                        onCreate: async (data) => {
                          if(data.st_status) {
                            const res = await addClassroomStudent({
                                student_id: data.student_id,
                                st_status: data.st_status,
                                classroom_id: Number(classId),
                              });
                              return res;
                          } else {
                            toast.error('نتيجة الطالب غير صالحة')
                            return {
                                success: false
                            }
                          }
                        },
                        onUpdate: async (data) => {
                          if(data.st_status) {
                            const res = await updateClassroomStudent({
                                id: data.id || 0,
                                student_id: data.student_id,
                                st_status: data.st_status,
                                classroom_id: Number(classId),
                              });
                              return res
                          } else {
                            toast.error('نتيجة الطالب غير صالحة')
                            return {
                                success: false
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
                <div className="flex-1">{sp.studentName}</div>
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
                        return deleteClassroomStudent(v);
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
          const c: StudentItem = {
            id: -1,
            studentName: '',
            student_id: 0,
            st_status: undefined,
            isEditing: true,
            isNew: true,
          };
          addField(c);
          setCurrentObj(c);
        }}
        disabled={isAdding}
      >
        <Plus className="h-4 w-4 ml-1" />
        إضافة طالب
      </Button>
    </>
  );
}
