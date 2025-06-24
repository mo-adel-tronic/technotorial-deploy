"use server";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { db } from "@/db/conn";
import { JobsType, Teacher } from "@/db/types";
import { appCache } from "@/lib/AppCache";
import { UpdateResult } from "kysely";

export async function fetchAllTeachers(): Promise<Teacher[] | undefined> {
  // const cachedData = appCache(
  //   async () => {
  //     return await db.selectFrom("teachers").selectAll().orderBy('t_order').execute();
  //   },
  //   [RevalidateKey.AllTeachers],
  //   { revalidate: 1800, tags: [RevalidateKey.AllTeachers] }
  // );
  // return cachedData();
  return await db.selectFrom("teachers").selectAll().orderBy('t_order').execute();
}

export async function findTeacherById(
  id: number
): Promise<Teacher | undefined> {
  const res = await db
        .selectFrom("teachers")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
  return res;
}

export async function findTeacherByEmail(
  token: string,
  email: string
): Promise<Teacher | undefined> {
  const cachedData = appCache(
    async () => {
      return await db
        .selectFrom("teachers")
        .selectAll()
        .where("email", "=", email)
        .where("access_token", "=", token)
        .executeTakeFirst();
    },
    [`${RevalidateKey.TeacherGetByEmail}/${email}`],
    { revalidate: 1800, tags: [`${RevalidateKey.TeacherGetByEmail}/${email}`] }
  );
  return cachedData();
}

export async function findTeacherByEmailWithJobs(
  token: string,
  email: string
): Promise<(Teacher & {jobs?: string | undefined}) | undefined> {
  const cachedData = appCache(
    async () => {
      const data = await db
        .selectFrom("teachers")
        .leftJoin('teachers_jobs', 'teachers_jobs.teacher_id', 'teachers.id')
        .select([
          'teachers.id as id',
          'teachers.name as name',
          'teachers.degree as degree',
          'teachers.email as email',
          'teachers.t_order as t_order',
          'teachers.access_token as access_token',
          db.fn("GROUP_CONCAT", ['teachers_jobs.job']).as("jobs"),
        ])
        .groupBy(["teachers.id"])
        .where("teachers.email", "=", email)
        .where("teachers.access_token", "=", token)
        .executeTakeFirst();

        return {
          id: data?.id,
          name: data?.name,
          degree: data?.degree,
          email: data?.email,
          t_order: data?.t_order,
          access_token: data?.access_token,
          jobs: data?.jobs
        }
    },
    [`${RevalidateKey.TeacherGetByEmailAndJob}/${email}`],
    { revalidate: 1800, tags: [`${RevalidateKey.TeacherGetByEmailAndJob}/${email}`] }
  );
  const result = await cachedData();
  if (!result) return undefined;
  return {
    id: result.id!,
    name: result.name!,
    degree: result.degree!,
    email: result.email!,
    t_order: result.t_order!,
    access_token: result.access_token!,
    jobs: result.jobs as string | undefined
  };
}

export async function getDepartTeachers(
  departId: number,
  job: JobsType[]
) : Promise<Teacher[] | undefined> {
  const res = await db
        .selectFrom("teachers")
        .innerJoin('teachers_jobs', 'teachers.id', 'teachers_jobs.teacher_id')
        .select([
          'teachers.id as id',
          'teachers.name as name',
          'teachers.degree as degree',
          'teachers.email as email',
          'teachers.t_order as t_order',
          'teachers.access_token as access_token'
        ])
        .where('teachers_jobs.depart_id', '=', departId)
        .where('teachers_jobs.job', 'in', job)
        .execute();
  return res;
}

export async function updateToken(
  token: string,
  email: string
): Promise<UpdateResult[]> {
  await fetch(process.env.APP_URL + RoutesName.API_REVALIDATE, {
    method: "POST",
    body: JSON.stringify({
      path: `${RevalidateKey.TeacherGetByEmail}/${email}`,
    }),
  });
  return db
    .updateTable("teachers")
    .set({ access_token: token })
    .where("email", "=", email)
    .execute();
}

export async function deleteTeacher(id: number): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("teachers").where("id", "=", id).execute()
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

export async function deleteBulkTeachers(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("teachers").where("id", "in", ids).execute()
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

export async function addTeacher(
  teacher: Teacher
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("teachers")
        .values({
          name: teacher.name,
          degree: teacher.degree,
          email: teacher.email,
          t_order: teacher.t_order
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

export async function updateTeacher(
  teacher: Teacher
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("teachers")
        .set({
          name: teacher.name,
          degree: teacher.degree,
          email: teacher.email,
          t_order: teacher.t_order
        })
        .where("id", "=", teacher.id)
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
