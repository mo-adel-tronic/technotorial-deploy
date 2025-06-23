"use client"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { JSX } from "react"

interface TableBulkActionsProps {
  selectedCount: number
  moreTools?: JSX.Element
  onDelete: () => void
}

export function TableBulkActions({
  selectedCount,
  onDelete,
  moreTools
}: TableBulkActionsProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-md">
      <span className="text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? "عنصر محدد" : "عناصر محددة"}
      </span>
      <div className="flex items-center gap-2 mr-auto">
        {moreTools ?? ''}
        <Button size="sm" variant="destructive" className="gap-1" onClick={onDelete}>
          <Trash className="h-4 w-4" />
          <span>حذف</span>
        </Button>
      </div>
    </div>
  )
}
