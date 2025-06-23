"use server";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { db } from "@/db/conn";
import { Semester } from "@/db/types";
import { appCache } from "@/lib/AppCache";

export async function fetchAllSemesters(): Promise<Semester[] | undefined> {
  const cachedData = appCache(
    async () => {
      return await db.selectFrom("duration_plans").selectAll().execute();
    },
    [RevalidateKey.AllSemesters],
    { revalidate: 1800, tags: [RevalidateKey.AllSemesters] }
  );
  return cachedData();
}

export async function fetchSemester(id: number): Promise<Semester | undefined> {
  const res = await db
    .selectFrom("duration_plans")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return res
    ? {
        id: res.id,
        edu_year: res.edu_year,
        semester: res.semester,
        term: res.term,
      }
    : undefined;
}

export async function addSemester(
  semester: Semester
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("duration_plans")
        .values({
          edu_year: semester.edu_year,
          semester: semester.semester,
          term: semester.term,
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

export async function updateSemester(
  semester: Semester
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("duration_plans")
        .set({
          edu_year: semester.edu_year,
          semester: semester.semester,
          term: semester.term,
        })
        .where("id", "=", semester.id)
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

export async function deleteSemester(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("duration_plans").where("id", "=", id).execute()
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

export async function deleteBulkSemesters(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("duration_plans").where("id", "in", ids).execute()
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
