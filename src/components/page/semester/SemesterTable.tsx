"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { Semester } from "@/db/types";
import { deleteBulkSemesters, deleteSemester } from "@/features/semesters/SemesterRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Semester[];
}
export default function SemesterTable({ data }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Semester | null>(null);
  const [semesterTable, setSemesterTable] =
    useState<TableType<Semester> | null>(null);
  const router = useRouter();
  const { revalidate } = useRevalidate();
  const confirmBulkDelete = async () => {
    let res: {
      success: boolean;
    };
    if (rowToDelete) {
      // Single row deletion
      res = await deleteSemester(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = semesterTable
        ? semesterTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkSemesters(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (semesterTable) semesterTable.resetRowSelection();
    }
    await revalidate(RevalidateKey.AllSemesters, RevalidateKey.AllSemesters);
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

  const columns: ColumnDef<Semester>[] = getTableCol<Semester>({
    fields: [
      {
        accessKey: "semester",
        header: "رقم المستوى",
      },
      {
        accessKey: "term",
        header: "الفصل الدراسي",
      },
      {
        accessKey: "edu_year",
        header: "العام الدراسي",
      },
    ],
    actions: [
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.SEMESTERS,
          text: "عرض تفاصيل المستوى",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.SEMESTERS,
          text: "تعديل بيانات المستوى",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setSemesterTable,
        },
      },
    ],
    setTableCall: setSemesterTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<Semester>
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
          if (!open) setSemesterTable(null);
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
