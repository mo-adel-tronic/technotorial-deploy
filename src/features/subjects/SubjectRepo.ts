"use server";

import { db } from "@/db/conn";
import { Subjects } from "@/db/types";

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
