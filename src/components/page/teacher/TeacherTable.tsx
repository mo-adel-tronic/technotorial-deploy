"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { Teacher } from "@/db/types";
import {
  deleteBulkTeachers,
  deleteTeacher,
} from "@/features/teachers/TeacherRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Teacher[];
}
export default function TeacherTable({ data }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Teacher | null>(null);
  const [teacherTable, setTeacherTable] = useState<TableType<Teacher> | null>(
    null
  );
  const router = useRouter();
  const { revalidate } = useRevalidate();
  const confirmBulkDelete = async () => {
    let res: {
      success: boolean;
    };
    if (rowToDelete) {
      // Single row deletion
      res = await deleteTeacher(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = teacherTable
        ? teacherTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkTeachers(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (teacherTable) teacherTable.resetRowSelection();
    }
    await revalidate(RevalidateKey.AllTeachers, RevalidateKey.AllTeachers);
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

  const columns: ColumnDef<Teacher>[] = getTableCol<Teacher>({
    fields: [
      {
        accessKey: "degree",
        header: "درجة العضو",
      },
      {
        accessKey: "name",
        header: "اسم العضو",
      },
      {
        accessKey: "email",
        header: "البريد الإلكتروني",
      },
      {
        accessKey: "t_order",
        header: "الأقدمية",
        headerSort: true,
      },
    ],
    actions: [
      {
        type: "copy",
        copiedKey: "email",
        copiedText: "نسخ البريد الإلكتروني",
      },
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.TEACHER,
          text: "عرض تفاصيل العضو",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.TEACHER,
          text: "تعديل بيانات العضو",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setTeacherTable,
        },
      },
    ],
    setTableCall: setTeacherTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<Teacher>
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
          if (!open) setTeacherTable(null);
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
