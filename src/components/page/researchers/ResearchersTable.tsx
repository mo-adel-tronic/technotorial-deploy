"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ResearcherDetails } from "@/db/types";
import {
  deleteResearcher,
  deleteBulkResearchers,
} from "@/features/researchers/ResearcherRepo";

interface Props {
  data: ResearcherDetails[];
}

export default function ResearcherTable({ data }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ResearcherDetails | null>(null);
  const [researcherTable, setResearcherTable] =
    useState<TableType<ResearcherDetails> | null>(null);
  const router = useRouter();
  const { revalidate } = useRevalidate();
  const confirmBulkDelete = async () => {
    let res: {
      success: boolean;
    };
    if (rowToDelete) {
      // Single row deletion
      res = await deleteResearcher(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = researcherTable
        ? researcherTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkResearchers(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (researcherTable) researcherTable.resetRowSelection();
    }
    await revalidate(
      RevalidateKey.AllResearchers,
      RevalidateKey.AllResearchers
    );
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

  const columns: ColumnDef<ResearcherDetails>[] = getTableCol<ResearcherDetails>({
    fields: [
      {
        accessKey: "name",
        header: "اسم الباحث",
        headerSort: true
      },
      {
        accessKey: "registered_at",
        header: "تاريخ القيد",
      },
      {
        accessKey: "student_code",
        header: "كود الباحث",
      },
      {
        accessKey: "advisorName",
        header: "المرشد الأكاديمي",
      },
      {
        accessKey: "departName",
        header: "القسم",
        headerSort: true
      },
      {
        accessKey: "programName",
        header: "البرنامج",
        headerSort: true
      },
      {
        accessKey: "statusList",
        header: "حالة الباحث",
      },
    ],
    actions: [
      {
        type: "copy",
        copiedKey: "student_code",
        copiedText: "نسخ كود الباحث",
      },
      {
        type: "copy",
        copiedKey: "national_n",
        copiedText: "نسخ الرقم القومي",
      },
      {
        type: "copy",
        copiedKey: "phone",
        copiedText: "نسخ رقم الهاتف",
      },
      {
        type: "copy",
        copiedKey: "nation_phone",
        copiedText: "نسخ رقم الهاتف الدولي",
      },
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.RESEARCHERS,
          text: "عرض بيانات الباحث",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.RESEARCHERS,
          text: "تعديل بيانات الباحث",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setResearcherTable,
        },
      },
    ],
    setTableCall: setResearcherTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<ResearcherDetails>
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
          if (!open) setResearcherTable(null);
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
