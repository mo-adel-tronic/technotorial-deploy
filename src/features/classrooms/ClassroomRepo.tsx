"use server";

import { db } from "@/db/conn";
import { Classroom, ClassroomDetails, ClassroomForEdit, ClassroomForView, ClassroomStudent, ClassroomStudentDetails } from "@/db/types";
import { sql } from "kysely";

export async function fetchClassroomsBySemester(
  semesterid: number
): Promise<ClassroomDetails[] | undefined> {
  const res = await db
    .selectFrom("classrooms")
    .innerJoin("teachers", "classrooms.teacher_id", "teachers.id")
    .innerJoin("subjects", "classrooms.subject_id", "subjects.id")
    .innerJoin(
      "program_requirements",
      "subjects.require_id",
      "program_requirements.id"
    )
    .innerJoin(
      "learning_programs",
      "program_requirements.program_id",
      "learning_programs.id"
    )
    .select([
      "classrooms.id as id",
      "subjects.name as subjectName",
      "teachers.name as teacherName",
      "learning_programs.name as programName",
    ])
    .where("classrooms.duration_plans", "=", semesterid)
    .execute();
  return res;
}

export async function fetchClassroomsBySemesterForView(
  classId: number
): Promise<ClassroomForView | undefined> {
  const res = await db
    .selectFrom("classrooms")
    .innerJoin("teachers", "classrooms.teacher_id", "teachers.id")
    .innerJoin("subjects", "classrooms.subject_id", "subjects.id")
    .innerJoin(
      "program_requirements",
      "subjects.require_id",
      "program_requirements.id"
    )
    .innerJoin(
      "learning_programs",
      "program_requirements.program_id",
      "learning_programs.id"
    )
    .innerJoin('department', 'learning_programs.depart_id', 'department.id')
    .select([
      "classrooms.id as id",
      "subjects.name as subjectName",
      "teachers.name as teacherName",
      "learning_programs.id as programId",
      "learning_programs.name as programName",
      "department.name as departName",
      "program_requirements.name as reqName",
      "program_requirements.type as reqType"
    ])
    .where("classrooms.id", "=", classId)
    .executeTakeFirst();
  return res;
}

export async function fetchClassroomForEdit(
  id: number
): Promise<ClassroomForEdit | undefined> {
  const res = await db
    .selectFrom("classrooms")
    .innerJoin("subjects", "classrooms.subject_id", "subjects.id")
    .innerJoin(
      "program_requirements",
      "subjects.require_id",
      "program_requirements.id"
    )
    .innerJoin(
      "learning_programs",
      "program_requirements.program_id",
      "learning_programs.id"
    )
    .select([
      "classrooms.subject_id as subject_id",
      "classrooms.teacher_id as teacher_id",
      "subjects.require_id as req_id",
      "program_requirements.program_id as program_id",
      "learning_programs.depart_id as depart_id",
    ])
    .where("classrooms.id", "=", id)
    .executeTakeFirst();
  return res
    ? {
        id: id,
        depart_id: res.depart_id,
        teacher_id: res.teacher_id,
        program_id: res.program_id,
        req_id: res.req_id,
        subject_id: res.subject_id,
      }
    : undefined;
}

export async function addClassroom(
  classroom: Classroom
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("classrooms")
        .values({
          duration_plans: classroom.duration_plans,
          subject_id: classroom.subject_id,
          teacher_id: classroom.teacher_id,
        })
        .execute()
    );
    return {
      success: true,
    };
  } catch (e) {
    console.log("insert error: ", e);
    return {
      success: false,
    };
  }
}

export async function updateClassroom(
  classroom: Classroom
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("classrooms")
        .set({
          duration_plans: classroom.duration_plans,
          subject_id: classroom.subject_id,
          teacher_id: classroom.teacher_id,
        })
        .where("id", "=", classroom.id)
        .execute()
    );
    return {
      success: true,
    };
  } catch (e) {
    console.log("update error: ", e);
    return {
      success: false,
    };
  }
}

export async function deleteClassroom(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("classrooms").where("id", "=", id).execute()
    );
    return {
      success: true,
    };
  } catch (e) {
    console.log("delete error: ", e);
    return {
      success: false,
    };
  }
}

export async function deleteBulkClassrooms(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("classrooms").where("id", "in", ids).execute()
    );
    return {
      success: true,
    };
  } catch (e) {
    console.log("delete error: ", e);
    return {
      success: false,
    };
  }
}


//! **************** Student Status
export async function fetchAllStudentsInClassroom(classId: number) : Promise<ClassroomStudentDetails[] | undefined> {
  const res = await db
    .selectFrom('results')
    .innerJoin('students', 'results.student_id', 'students.id')
    .select([
      'results.id as id', 
      'results.student_id as student_id', 
      'students.name as studentName', 
      'results.st_status as st_status'])
    .where('results.classroom_id', '=', classId)
    .execute()
  return res
}

export async function addClassroomStudent(
  classroomStudent: ClassroomStudent
): Promise<{ success: boolean; id?: number; rowInserted?: number }> {
  try {
    const res = await sql`INSERT INTO results (student_id, classroom_id, st_status) SELECT ${classroomStudent.student_id}, ${classroomStudent.classroom_id}, ${classroomStudent.st_status} 
  WHERE NOT EXISTS (
    SELECT 1 FROM results WHERE student_id = ${classroomStudent.student_id} AND classroom_id = ${classroomStudent.classroom_id}
  )
`.execute(db);

    return {
      success: true,
      id: res.insertId !== undefined ? Number(res.insertId) : undefined,
      rowInserted:
        res.numAffectedRows !== undefined
          ? Number(res.numAffectedRows)
          : undefined,
    };
  } catch (e) {
    console.log("insert error: ", e);
    return {
      success: false,
    };
  }
}

export async function updateClassroomStudent(
  classroomStudent: ClassroomStudent
): Promise<{ success: boolean; rowChanged?: number }> {
  try {
    const res = await sql`
    UPDATE results
    SET student_id = ${classroomStudent.student_id}, classroom_id = ${classroomStudent.classroom_id}, st_status = ${classroomStudent.st_status}
    WHERE id = ${classroomStudent.id}
    AND NOT EXISTS (
        SELECT 1 FROM results
        WHERE student_id = ${classroomStudent.student_id} AND classroom_id = ${classroomStudent.classroom_id} AND st_status = ${classroomStudent.st_status}
    );
`.execute(db);
    return {
      success: true,
      rowChanged:
        res.numChangedRows !== undefined
          ? Number(res.numChangedRows)
          : undefined,
    };
  } catch (e) {
    console.log("update error: ", e);
    return {
      success: false,
    };
  }
}

export async function deleteClassroomStudent(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("results").where("id", "=", id).execute()
    );
    return {
      success: true,
    };
  } catch (e) {
    console.log("delete error: ", e);
    return {
      success: false,
    };
  }
}