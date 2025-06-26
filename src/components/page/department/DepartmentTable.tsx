"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { Department } from "@/db/types";
import {
  deleteBulkDepartments,
  deleteDepartment,
} from "@/features/department/DepartmentRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Department[];
}
export default function DepartmentTable({ data }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Department | null>(null);
  const [departmentTable, setDepartmentTable] =
    useState<TableType<Department> | null>(null);
  const router = useRouter();
  const { revalidate } = useRevalidate();
  const confirmBulkDelete = async () => {
    let res: {
      success: boolean;
    };
    if (rowToDelete) {
      // Single row deletion
      res = await deleteDepartment(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = departmentTable
        ? departmentTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkDepartments(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (departmentTable) departmentTable.resetRowSelection();
    }
    await revalidate(RevalidateKey.AllDepartment, RevalidateKey.AllDepartment);
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

  const columns: ColumnDef<Department>[] = getTableCol<Department>({
    fields: [
      {
        accessKey: "name",
        header: "اسم القسم",
      },
      {
        accessKey: "depart_code",
        header: "كود القسم",
      },
    ],
    actions: [
      // {
      //   type: "copy",
      //   copiedKey: "code",
      //   copiedText: "نسخ كود القسم",
      // },
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.DEPARTMENT,
          text: "عرض تفاصيل القسم",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.DEPARTMENT,
          text: "تعديل بيانات القسم",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setDepartmentTable,
        },
      },
    ],
    setTableCall: setDepartmentTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<Department>
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
          if (!open) setDepartmentTable(null);
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
