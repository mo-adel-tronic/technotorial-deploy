'use server'
import { db } from "@/db/conn";
import { Requirements } from "@/db/types";

export async function fetchRequirementById(
  id: number
): Promise<Requirements | undefined> {
  const res = await db
        .selectFrom("program_requirements")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
  return res;
}

export async function fetchRequirement(
  programid: number
): Promise<Requirements[] | undefined> {
  const res = await db
        .selectFrom("program_requirements")
        .selectAll()
        .where("program_id", "=", programid)
        .execute();
  return res;
}

export async function deleteRequirement(id: number): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("program_requirements").where("id", "=", id).execute()
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

export async function deleteBulkRequirements(
  ids: number[]
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("program_requirements").where("id", "in", ids).execute()
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

export async function addRequirements(
  req: Requirements
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .insertInto("program_requirements")
        .values({
          name: req.name,
          type: req.type,
          credit_hour: req.credit_hour,
          require_code: req.require_code,
          program_id: req.program_id
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

export async function updateRequirements(
  req: Requirements
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db
        .updateTable("program_requirements")
        .set({
          name: req.name,
          type: req.type,
          credit_hour: req.credit_hour,
          require_code: req.require_code,
          program_id: req.program_id
        })
        .where("id", "=", req.id)
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