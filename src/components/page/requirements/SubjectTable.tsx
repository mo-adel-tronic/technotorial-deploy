"use client";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import AppTable from "@/components/shared/table/AppTable";
import getTableCol from "@/components/shared/table/TableCols";
import { RevalidateKey } from "@/constants/RevalidateKey";
import { RoutesName } from "@/constants/RoutesName";
import { Subjects } from "@/db/types";
import { deleteBulkSubjects, deleteSubject } from "@/features/subjects/SubjectRepo";
import { useRevalidate } from "@/hooks/revalidate";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Subjects[];
  programId: number;
  reqId: number
}
export default function SubjectTable({ data, programId, reqId }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Subjects | null>(null);
  const [subjectTable, setSubjectTable] = useState<TableType<Subjects> | null>(
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
      res = await deleteSubject(rowToDelete.id || 0);
      //! delete single item
      setRowToDelete(null);
    } else {
      // Bulk deletion
      const selectedRows = subjectTable
        ? subjectTable.getFilteredSelectedRowModel().rows
        : [];
      const selectedIds = selectedRows.map((row) => row.original.id || 0);
      res = await deleteBulkSubjects(selectedIds);
      //! Delete Bulk items
      // Reset selection after action
      if (subjectTable) subjectTable.resetRowSelection();
    }
    await revalidate(RevalidateKey.AllSubjects, RevalidateKey.AllSubjects);
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

  const columns: ColumnDef<Subjects>[] = getTableCol<Subjects>({
    fields: [
      {
        accessKey: "name",
        header: "اسم المقرر",
      },
      {
        accessKey: "subject_code",
        header: "كود المقرر",
      },
      {
        accessKey: "credit_hour",
        header: "عدد الساعات",
      }
    ],
    actions: [
      {
        type: "copy",
        copiedKey: "subject_code",
        copiedText: "نسخ كود المقرر",
      },
      {
        type: "navigate",
        link: {
          type: "view",
          href: RoutesName.PROGRAMS+'/'+ programId.toString() + RoutesName.REQUIREMENTS + '/' + reqId + RoutesName.SUBJECTS,
          text: "عرض تفاصيل المقرر",
        },
      },
      {
        type: "navigate",
        link: {
          type: "edit",
          href: RoutesName.PROGRAMS+'/'+ programId.toString() + RoutesName.REQUIREMENTS + '/' + reqId + RoutesName.SUBJECTS,
          text: "تعديل بيانات المقرر",
        },
      },
      {
        type: "delete",
        deleteFuncs: {
          setRow: setRowToDelete,
          setIsDialogOpen: setIsDeleteDialogOpen,
          setTable: setSubjectTable,
        },
      },
    ],
    setTableCall: setSubjectTable,
  });

  return (
    <div>
      {/* Table */}
      <AppTable<Subjects>
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
          if (!open) setSubjectTable(null);
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
