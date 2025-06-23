"use server";

import { RevalidateKey } from "@/constants/RevalidateKey";
import { db } from "@/db/conn";
import { Programs } from "@/db/types";
import { appCache } from "@/lib/AppCache";
import { sql } from "kysely";
import { ProgramsClient } from "./types";

export async function fetchAllPrograms(): Promise<ProgramsClient[] | undefined> {
  const cachedData = appCache(
    async () => {
      return await db.selectFrom("learning_programs").innerJoin('department', 'learning_programs.depart_id', 'department.id').select(['learning_programs.id', 'learning_programs.name', 'learning_programs.paper_hours', 'learning_programs.subject_hours', 'learning_programs.program_code', 'learning_programs.depart_id', sql<string>`department.name`.as('depart_name')]).execute();
    },
    [RevalidateKey.AllPrograms],
    { revalidate: 1800, tags: [RevalidateKey.AllPrograms] }
  );
  return cachedData();
}

export async function fetchProgramsById(
  departId: number
): Promise<Programs[] | undefined> {
  const res = await db
    .selectFrom("learning_programs")
    .selectAll()
    .where("depart_id", "=", departId)
    .execute();
  return res
    ? res.map((item) => {
        return {
          id: item.id!,
          name: item.name,
          subject_hours: item.subject_hours,
          paper_hours: item.paper_hours,
          program_code: item.program_code,
          depart_id: item.depart_id,
        } as Programs;
      })
    : undefined;
}

export async function fetchProgram(
  id: number
): Promise<Programs | undefined> {
  const res = await db
        .selectFrom("learning_programs")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
  return res;
}

export async function deletePrograms(id: number): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("learning_programs").where("id", "=", id).execute()
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

export async function deleteBulkPrograms(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("learning_programs").where("id", "in", ids).execute()
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

export async function addPrograms(
  program: Programs
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("learning_programs")
        .values({
          name: program.name,
          depart_id: program.depart_id,
          paper_hours: program.paper_hours,
          subject_hours: program.subject_hours,
          program_code: program.program_code
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

export async function updatePrograms(
  program: Programs
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("learning_programs")
        .set({
          name: program.name,
          depart_id: program.depart_id,
          paper_hours: program.paper_hours,
          subject_hours: program.subject_hours,
          program_code: program.program_code
        })
        .where("id", "=", program.id)
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