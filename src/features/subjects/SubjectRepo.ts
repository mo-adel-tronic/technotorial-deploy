"use server";

import { db } from "@/db/conn";
import { Subjects } from "@/db/types";
import { sql } from "kysely";

export async function fetchSubjectById(
  id: number
): Promise<Subjects | undefined> {
  const res = await db
    .selectFrom("subjects")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return res;
}

export async function fetchSubjectByReq(
  requireId: number
): Promise<Subjects[] | undefined> {
  const data = await db
    .selectFrom("subjects")
    .selectAll()
    .where("require_id", "=", requireId)
    .execute();
  return data;
}
export async function fetchSubjectByReqWithFullCode(
  requireId: number
): Promise<(Subjects)[] | undefined> {
  const data = await db
    .selectFrom("subjects")
    .innerJoin('program_requirements', 'subjects.require_id', 'program_requirements.id')
    .innerJoin('learning_programs', 'program_requirements.program_id', 'learning_programs.id')
    .innerJoin("department", 'learning_programs.depart_id', 'department.id')
    .select([
      "subjects.id as id",
      'subjects.name as name',
      'subjects.theoretical_hour as theoretical_hour',
      'subjects.practical_hour as practical_hour',
      'subjects.credit_hour as credit_hour',
      'subjects.theoretical_exam_duration as theoretical_exam_duration',
      'subjects.practical_exam_duration as practical_exam_duration',
      'subjects.theoretical_degree as theoretical_degree',
      'subjects.practical_degree as practical_degree',
      'subjects.activity_degree as activity_degree',
      'subjects.require_id as require_id',
      sql<string>`CONCAT(department.depart_code, '.', learning_programs.program_code, '.', program_requirements.require_code, '.', subjects.subject_code)`.as('subject_code')
    ])
    .where("require_id", "=", requireId)
    .execute();
  return data;
}

export async function deleteSubject(id: number): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("subjects").where("id", "=", id).execute()
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

export async function deleteBulkSubjects(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("subjects").where("id", "in", ids).execute()
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

export async function addSubject(sub: Subjects): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("subjects")
        .values({
          name: sub.name,
          subject_code: sub.subject_code,
          theoretical_hour: sub.theoretical_hour,
          practical_hour: sub.practical_hour,
          credit_hour: sub.credit_hour,
          theoretical_exam_duration: sub.theoretical_exam_duration,
          practical_exam_duration: sub.practical_exam_duration,
          theoretical_degree: sub.theoretical_degree,
          practical_degree: sub.practical_degree,
          activity_degree: sub.activity_degree,
          require_id: sub.require_id,
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

export async function updateSubject(
  sub: Subjects
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("subjects")
        .set({
          name: sub.name,
          subject_code: sub.subject_code,
          theoretical_hour: sub.theoretical_hour,
          practical_hour: sub.practical_hour,
          credit_hour: sub.credit_hour,
          theoretical_exam_duration: sub.theoretical_exam_duration,
          practical_exam_duration: sub.practical_exam_duration,
          theoretical_degree: sub.theoretical_degree,
          practical_degree: sub.practical_degree,
          activity_degree: sub.activity_degree,
        })
        .where("id", "=", sub.id)
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
