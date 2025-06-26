"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { deleteBulkPrograms, deletePrograms } from "@/features/programs/ProgramsRepo";
import { ProgramsClient } from "@/features/programs/types";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: ProgramsClient[];
}
export default function ProgramsTable({ data }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ProgramsClient | null>(null);
  const [programsTable, setProgramsTable] = useState<TableType<ProgramsClient> | null>(
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
      res = await deletePrograms(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = programsTable
        ? programsTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkPrograms(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (programsTable) programsTable.resetRowSelection();
    }
    await revalidate(RevalidateKey.AllPrograms, RevalidateKey.AllPrograms);
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

  const columns: ColumnDef<ProgramsClient>[] = getTableCol<ProgramsClient>({
    fields: [
      {
        accessKey: "name",
        header: "اسم البرنامج",
      },
      {
        accessKey: "program_code",
        header: "كود البرنامج",
      },
      {
        accessKey: "depart_name",
        header: "القسم التابع له",
      }
    ],
    actions: [
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.PROGRAMS,
          text: "عرض تفاصيل البرنامج",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.PROGRAMS,
          text: "تعديل بيانات البرنامج",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setProgramsTable,
        },
      },
    ],
    setTableCall: setProgramsTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<ProgramsClient>
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
          if (!open) setProgramsTable(null);
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
