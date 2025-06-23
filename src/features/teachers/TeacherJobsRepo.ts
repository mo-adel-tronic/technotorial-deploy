'use server'
import { db } from "@/db/conn";
import { JobsWithDepartment } from "./types";
import { TeacherJobs } from "@/db/types";
import { sql } from "kysely";

export async function fetchJobs(
  teacherId: number
): Promise<JobsWithDepartment[] | undefined> {
  const res = await db
    .selectFrom("teachers_jobs")
    .innerJoin('department', 'department.id', 'teachers_jobs.depart_id')
    .select(['teachers_jobs.id', 'teachers_jobs.job', 'department.name', 'depart_id'])
    .where("teacher_id", "=", teacherId)
    .execute();
  return res
    ? res.map((item) => {
        return {
          id: item.id!,
          job: item.job,
          departName: item.name,
          depart_id: item.depart_id
        } as JobsWithDepartment;
      })
    : undefined;
}

export async function addTeacherJob(
  teacherJobs: TeacherJobs
): Promise<{ success: boolean; id?: number; rowInserted?: number }> {
  try {
    const res = await sql`
  INSERT INTO teachers_jobs (job, depart_id, teacher_id)
  SELECT ${teacherJobs.job}, ${teacherJobs.depart_id}, ${teacherJobs.teacher_id} 
  WHERE NOT EXISTS (
    SELECT 1 FROM teachers_jobs WHERE job = ${teacherJobs.job} AND depart_id = ${teacherJobs.depart_id} AND teacher_id = ${teacherJobs.teacher_id}
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

export async function updateTeacherJob(
  teacherJobs: TeacherJobs
): Promise<{ success: boolean; rowChanged?: number }> {
  try {
    const res = await sql`
    UPDATE teachers_jobs
    SET job = ${teacherJobs.job}, depart_id = ${teacherJobs.depart_id}, teacher_id = ${teacherJobs.teacher_id}
    WHERE id = ${teacherJobs.id}
    AND NOT EXISTS (
        SELECT 1 FROM teachers_jobs
        WHERE job = ${teacherJobs.job} AND depart_id = ${teacherJobs.depart_id} AND teacher_id = ${teacherJobs.teacher_id}
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

export async function deleteTeacherJob(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("teachers_jobs").where("id", "=", id).execute()
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