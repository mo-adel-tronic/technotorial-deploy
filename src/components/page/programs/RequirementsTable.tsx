"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RoutesName } from "@/constants/RoutesName";
import { Requirements } from "@/db/types";
import { deleteBulkRequirements, deleteRequirement } from "@/features/requirements/RequirementRepo";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Requirements[];
  programId: number
}
export default function RequirementTable({ data, programId }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Requirements | null>(null);
  const [requirementTable, setRequirementTable] = useState<TableType<Requirements> | null>(
    null
  );
  const router = useRouter();
  const confirmBulkDelete = async () => {
    let res: {
      success: boolean;
    };
    if (rowToDelete) {
      // Single row deletion
      res = await deleteRequirement(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = requirementTable
        ? requirementTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkRequirements(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (requirementTable) requirementTable.resetRowSelection();
    }
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

  const columns: ColumnDef<Requirements>[] = getTableCol<Requirements>({
    fields: [
      {
        accessKey: "name",
        header: "اسم المتطلب",
      },
      {
        accessKey: "require_code",
        header: "كود المتطلب",
      },
      {
        accessKey: "type",
        header: "حالة المتطلب",
      },
      {
        accessKey: "credit_hour",
        header: "عدد الساعات",
      }
    ],
    actions: [
      {
        type: "copy",
        copiedKey: "require_code",
        copiedText: "نسخ كود المتطلب",
      },
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.PROGRAMS+'/'+ programId.toString() + RoutesName.REQUIREMENTS,
          text: "عرض تفاصيل المتطلب",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.PROGRAMS+'/'+ programId.toString() + RoutesName.REQUIREMENTS,
          text: "تعديل بيانات المتطلب",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setRequirementTable,
        },
      },
    ],
    setTableCall: setRequirementTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<Requirements>
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
          if (!open) setRequirementTable(null);
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
