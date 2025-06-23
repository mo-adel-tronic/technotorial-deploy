"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { ClassroomDetails } from "@/db/types";
import { deleteBulkClassrooms, deleteClassroom } from "@/features/classrooms/ClassroomRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: ClassroomDetails[];
  semesterid: number
}
export default function ClassroomTable({ data, semesterid }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ClassroomDetails | null>(null);
  const [classroomTable, setClassroomTable] =
    useState<TableType<ClassroomDetails> | null>(null);
  const router = useRouter();
  const { revalidate } = useRevalidate();
  const confirmBulkDelete = async () => {
    let res: {
      success: boolean;
    };
    if (rowToDelete) {
      // Single row deletion
      res = await deleteClassroom(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = classroomTable
        ? classroomTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkClassrooms(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (classroomTable) classroomTable.resetRowSelection();
    }
    await revalidate(RevalidateKey.AllClassrooms, RevalidateKey.AllClassrooms);
    router.refresh();
    if (res.success) {
      toast.success("تم عملية الحذف بنجاح");
    } else {
      toast.error("هناك مشكلة في تنفيذ أمر الحذف، حاول مره أخرى");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<ClassroomDetails>[] = getTableCol<ClassroomDetails>({
    fields: [
      {
        accessKey: "subjectName",
        header: "اسم المقرر",
        headerSort: true
      },
      {
        accessKey: "programName",
        header: "اسم البرنامج",
        headerSort: true
      },
      {
        accessKey: "teacherName",
        header: "اسم عضو هيئة التدريس",
        headerSort: true
      },
    ],
    actions: [
      {
        type: "navigate",
        link: {
          type: "view",
          href: `${RoutesName.SEMESTERS}/${semesterid}${RoutesName.CLASS_TABLE}`,
          text: "عرض التفاصيل",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: `${RoutesName.SEMESTERS}/${semesterid}${RoutesName.CLASS_TABLE}`,
          text: "تعديل البيانات",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setClassroomTable,
        },
      },
    ],
    setTableCall: setClassroomTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<ClassroomDetails>
        data={data}
        columns={columns}
        BulkActions={handleBulkDelete}
      />

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setRowToDelete(null);
          if (!open) setClassroomTable(null);
        }}
        title="تأكيد الحذف"
        description={
          rowToDelete
            ? `هل أنت متأكد من إجراء عملية الحذف لهذا العنصر`
            : `هل أنت متأكد من رغبتك في حذف العناصر المحددة`
        }
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}
