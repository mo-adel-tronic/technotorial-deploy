"use server";

import { db } from "@/db/conn";
import { Specialization } from "@/db/types";
import { sql } from "kysely";

export async function fetchSpecialization(
  departId: number
): Promise<Specialization[] | undefined> {
  const res = await db
    .selectFrom("specialization")
    .selectAll()
    .where("depart_id", "=", departId)
    .execute();
  return res
    ? res.map((item) => {
        return {
          id: item.id!,
          name: item.name,
          depart_id: item.depart_id,
        } as Specialization;
      })
    : undefined;
}

export async function addSpecialization(
  spec: Specialization
): Promise<{ success: boolean; id?: number; rowInserted?: number }> {
  try {
    const res = await sql`
  INSERT INTO specialization (name, depart_id)
  SELECT ${spec.name}, ${spec.depart_id}
  WHERE NOT EXISTS (
    SELECT 1 FROM specialization WHERE name = ${spec.name} AND depart_id = ${spec.depart_id}
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

export async function updateSpecialization(
  spec: Specialization
): Promise<{ success: boolean; rowChanged?: number }> {
  try {
    const res = await sql`
    UPDATE specialization
    SET name = ${spec.name}
    WHERE id = ${spec.id}
    AND NOT EXISTS (
        SELECT 1 FROM specialization
        WHERE name = ${spec.name} AND depart_id = ${spec.depart_id}
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


export async function deleteSpecialization(
  id: number
): Promise<{ success: boolean }> {
  try {
    await Promise.resolve(
      db.deleteFrom("specialization").where("id", "=", id).execute()
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