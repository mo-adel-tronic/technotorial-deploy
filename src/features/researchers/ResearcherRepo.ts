"use server";
import { appCache } from "@/lib/AppCache";
import { db } from "@/db/conn";
import { ResearcherDetails, Researchers, StudentSemesterListType, StudentStatus, StudentStatusCases } from "@/db/types";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { sql } from "kysely";

export async function fetchAllResearchers(): Promise<
  Researchers[] | undefined
> {
  const cachedData = appCache(
    async () => {
      const data: Researchers[] = await db
        .selectFrom("students")
        .selectAll()
        .execute();
      return data.map((researcher) => {
        return {
          id: researcher.id,
          name: researcher.name,
          registered_at: researcher.registered_at ?? "لا يوجد",
          student_code: researcher.student_code,
          national_n: researcher.national_n ?? "لا يوجد",
          phone: researcher.phone ?? "لا يوجد",
          nation_phone: researcher.nation_phone ?? "لا يوجد",
          advisor: researcher.advisor ?? "لا يوجد",
          specialization_id: researcher.specialization_id,
          program_id: researcher.program_id,
        };
      }) as Researchers[];
    },
    [RevalidateKey.AllResearchers],
    { revalidate: 1800, tags: [RevalidateKey.AllResearchers] }
  );
  return cachedData();
}

export async function fetchAllResearchersDetails(): Promise<
  ResearcherDetails[] | undefined
> {
  const cachedData = appCache(
    async () => {
      const data = await db
        .selectFrom("students")
        .leftJoin("teachers", "students.advisor", "teachers.id")
        .innerJoin(
          "specialization",
          "students.specialization_id",
          "specialization.id"
        )
        .innerJoin("department", "specialization.depart_id", "department.id")
        .innerJoin(
          "learning_programs",
          "students.program_id",
          "learning_programs.id"
        )
        .leftJoin("student_status", "students.id", "student_status.student_id")
        .select([
          "students.id as student_id",
          "students.name as student_name",
          "students.nation_phone as student_nation_phone",
          "students.national_n as student_national_n",
          "students.phone as student_phone",
          "students.student_code as student_code",
          "students.registered_at as student_registered_at",
          "teachers.name as advisor_name",
          "teachers.degree as advisor_degree",
          "specialization.name as specialization_name",
          "department.name as department_name",
          "learning_programs.name as program_name",
          db.fn("GROUP_CONCAT", ["student_status.name"]).as("status"),
        ])
        .groupBy([
          "student_id",
          "student_name",
          "student_nation_phone",
          "student_national_n",
          "student_phone",
          "student_code",
          "student_registered_at",
          "advisor_name",
          "advisor_degree",
          "specialization_name",
          "department_name",
          "program_name",
        ])
        .execute();
      return data.map((re) => {
        return {
          id: re.student_id,
          name: re.student_name,
          registered_at: re.student_registered_at
            ? typeof re.student_registered_at === "string"
              ? re.student_registered_at
              : toLocalDateString(re.student_registered_at)
            : "لا يوجد",
          student_code: re.student_code,
          national_n: re.student_national_n ?? "لا يوجد",
          phone: re.student_phone ?? "لا يوجد",
          nation_phone: re.student_nation_phone ?? "لا يوجد",
          advisorName: re.advisor_name
            ? `${re.advisor_degree}/${re.advisor_name}`
            : "لا يوجد",
          specializeName: re.specialization_name,
          departName: re.department_name,
          programName: re.program_name,
          statusList: (re.status as string)
            ? (re.status as string).split(",").map((item) => {
                let color = "bg-black";
                switch (item as StudentStatusCases) {
                  case "مستجد":
                    color = "bg-green-500";
                    break;
                  case "جاري الدراسة":
                    color = "bg-green-700";
                    break;
                  case "تم التسجيل":
                    color = "bg-blue-400";
                    break;
                  case "استوفى الدراسة":
                    color = "bg-blue-600";
                    break;
                  case "سحب ملف":
                    color = "bg-red-500";
                    break;
                  case "إيقاف قيد":
                    color = "bg-amber-500";
                    break;
                }
                return {
                  k: item,
                  color: color,
                };
              })
            : "لا يوجد",
        };
      });
    },
    [RevalidateKey.AllResearchersDetails],
    { revalidate: 1800, tags: [RevalidateKey.AllResearchersDetails] }
  );
  return cachedData();
}

export async function viewReseacher(
  id: number
): Promise<ResearcherDetails | undefined> {
  const re = await db
    .selectFrom("students")
    .leftJoin("teachers", "students.advisor", "teachers.id")
    .innerJoin(
      "specialization",
      "students.specialization_id",
      "specialization.id"
    )
    .innerJoin("department", "specialization.depart_id", "department.id")
    .innerJoin(
      "learning_programs",
      "students.program_id",
      "learning_programs.id"
    )
    .leftJoin("student_status", "students.id", "student_status.student_id")
    .select([
      "students.id as student_id",
      "students.name as student_name",
      "students.nation_phone as student_nation_phone",
      "students.national_n as student_national_n",
      "students.phone as student_phone",
      "students.student_code as student_code",
      "students.registered_at as student_registered_at",
      "teachers.name as advisor_name",
      "teachers.degree as advisor_degree",
      "specialization.name as specialization_name",
      "department.name as department_name",
      "learning_programs.name as program_name",
      db.fn("GROUP_CONCAT", ["student_status.name"]).as("status"),
    ])
    .groupBy([
      "student_id",
      "student_name",
      "student_nation_phone",
      "student_national_n",
      "student_phone",
      "student_code",
      "student_registered_at",
      "advisor_name",
      "advisor_degree",
      "specialization_name",
      "department_name",
      "program_name",
    ])
    .where("students.id", "=", id)
    .executeTakeFirst();

  return re
    ? {
        id: re.student_id,
        name: re.student_name,
        registered_at: re.student_registered_at
          ? typeof re.student_registered_at === "string"
            ? re.student_registered_at
            : toLocalDateString(re.student_registered_at)
          : "لا يوجد",
        student_code: re.student_code,
        national_n: re.student_national_n ?? "لا يوجد",
        phone: re.student_phone ?? "لا يوجد",
        nation_phone: re.student_nation_phone ?? "لا يوجد",
        advisorName: re.advisor_name
          ? `${re.advisor_degree}/${re.advisor_name}`
          : "لا يوجد",
        specializeName: re.specialization_name,
        departName: re.department_name,
        programName: re.program_name,
        statusList: (re.status as string)
          ? (re.status as string).split(",").map((item) => {
              let color = "bg-black";
              switch (item as StudentStatusCases) {
                case "مستجد":
                  color = "bg-green-500";
                  break;
                case "جاري الدراسة":
                  color = "bg-green-700";
                  break;
                case "تم التسجيل":
                  color = "bg-blue-400";
                  break;
                case "استوفى الدراسة":
                  color = "bg-blue-600";
                  break;
                case "سحب ملف":
                  color = "bg-red-500";
                  break;
                case "إيقاف قيد":
                  color = "bg-amber-500";
                  break;
              }
              return {
                k: item,
                color: color,
              };
            })
          : [],
      }
    : undefined;
}

export async function fetchResearcherStatus (researcherId: number) : Promise<StudentStatus[] | undefined> {
  const res = await db
    .selectFrom('student_status')
    .selectAll()
    .where('student_id', '=', researcherId)
    .execute()

    return res as StudentStatus[] ?? undefined
}

export async function deleteResearchStatus(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("student_status").where("id", "=", id).execute()
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

export async function updateResearchStatus(
  researchStatus: StudentStatus
): Promise<{ success: boolean; rowChanged?: number }> {
  try {
    const res = await sql`
    UPDATE student_status
    SET name = ${researchStatus.name}, student_id = ${researchStatus.student_id}
    WHERE id = ${researchStatus.id}
    AND NOT EXISTS (
        SELECT 1 FROM student_status
        WHERE name = ${researchStatus.name} AND student_id = ${researchStatus.student_id}
    );`
    .execute(db);
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

export async function addResearchStatus(
  researchStatus: StudentStatus
): Promise<{ success: boolean; id?: number; rowInserted?: number }> {
  try {
    const res = await sql`
  INSERT INTO student_status (name, student_id)
  SELECT ${researchStatus.name}, ${researchStatus.student_id}
  WHERE NOT EXISTS (
    SELECT 1 FROM student_status WHERE name = ${researchStatus.name} AND student_id = ${researchStatus.student_id}
  )`
  .execute(db);

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

export async function fetchResearcher(
  id: number
): Promise<(Researchers & { department: number }) | undefined> {
  const res = await db
    .selectFrom("students")
    .innerJoin(
      "specialization",
      "students.specialization_id",
      "specialization.id"
    )
    .select([
      "students.id as student_id",
      "students.name as student_name",
      "students.nation_phone as student_nation_phone",
      "students.national_n as student_national_n",
      "students.phone as student_phone",
      "students.student_code as student_code",
      "students.registered_at as student_registered_at",
      "students.advisor as advisor",
      "students.program_id as program_id",
      "students.specialization_id as spec_id",
      "specialization.depart_id as depart_id",
    ])
    .where("students.id", "=", id)
    .executeTakeFirst();
  return res
    ? {
        id: res.student_id,
        name: res.student_name,
        registered_at: res.student_registered_at
          ? typeof res.student_registered_at === "string"
            ? res.student_registered_at
            : toLocalDateString(res.student_registered_at)
          : undefined,
        student_code: res.student_code,
        national_n: res.student_national_n,
        phone: res.student_phone,
        nation_phone: res.student_nation_phone,
        advisor: res.advisor,
        specialization_id: res.spec_id,
        program_id: res.program_id,
        department: res.depart_id,
      }
    : undefined;
}

export async function deleteResearcher(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("students").where("id", "=", id).execute()
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

export async function deleteBulkResearchers(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("students").where("id", "in", ids).execute()
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

export async function addResearcher(
  researcher: Researchers
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("students")
        .values({
          name: researcher.name,
          registered_at: researcher.registered_at,
          student_code: researcher.student_code,
          national_n: researcher.national_n,
          phone: researcher.phone,
          nation_phone: researcher.nation_phone,
          advisor: researcher.advisor,
          specialization_id: researcher.specialization_id,
          program_id: researcher.program_id,
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

export async function updateResearcher(
  researcher: Researchers
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("students")
        .set({
          name: researcher.name,
          registered_at: researcher.registered_at,
          student_code: researcher.student_code,
          national_n: researcher.national_n,
          phone: researcher.phone,
          nation_phone: researcher.nation_phone,
          advisor: researcher.advisor,
          specialization_id: researcher.specialization_id,
          program_id: researcher.program_id,
        })
        .where("id", "=", researcher.id)
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

function toLocalDateString(date: Date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getStudentForAssignSemester (programId: number) : Promise<StudentSemesterListType[] | undefined> {
  const res = await db
    .selectFrom('students')
    .leftJoin("student_status", "students.id", "student_status.student_id")
    .select([
      'students.id as id',
      'students.name as name',
      db.fn("GROUP_CONCAT", ["student_status.name"]).as("status"),
    ])
    .where('students.program_id', '=', programId)
    .where('student_status.name', 'in', ['تم التسجيل', 'جاري الدراسة', 'مستجد'])
    .groupBy(["student_id"])
    .execute()

    return res.length ? res.map(v => ({
      id: v.id!,
      name: v.name,
      status: (v.status as string).split(',')
    })) : undefined
}
