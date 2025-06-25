import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Table, type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction } from "react";
interface FieldType {
  accessKey: string;
  header: string;
  headerSort?: boolean;
}
interface ActionType<T> {
  type: "copy" | "navigate" | "delete";
  copiedKey?: string;
  copiedText?: string;
  link?: {
    type: "view" | "edit";
    href: string;
    text: string;
  };
  deleteFuncs?: {
    setRow: Dispatch<SetStateAction<T | null>>;
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
    setTable: Dispatch<SetStateAction<Table<T> | null>>;
  };
}
interface Props<T> {
  selectCheck?: boolean;
  fields: FieldType[];
  actions?: ActionType<T>[];
  setTableCall?: Dispatch<SetStateAction<Table<T> | null>>;
}
export default function getTableCol<T extends { id?: number }>({
  selectCheck = true,
  fields,
  actions,
  setTableCall,
}: Props<T>): ColumnDef<T>[] {
  const cols: ColumnDef<T>[] = [];
  if (selectCheck) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (setTableCall) {
              setTableCall(table);
            }
          }}
          aria-label="تحديد الكل"
        />
      ),
      cell: ({ table, row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (setTableCall) {
              setTableCall(table);
            }
          }}
          aria-label="تحديد الصف"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  if (fields.length) {
    fields.forEach((field) => {
      cols.push({
        accessorKey: field.accessKey,
        header: field.headerSort
          ? ({ column }) => {
              return (
                <Button
                  className="font-bold text-lg text-center"
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {field.header}
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
              );
            }
          : field.header,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {Array.isArray(row.getValue(field.accessKey)) ? (row.getValue(field.accessKey) as {k: string, color: string}[]).map((item, i) => {
                  return <Badge key={i} className={`${item.color} font-bold mr-2`}>{item.k}</Badge>
                }) : row.getValue(field.accessKey)}
              </span>
            </div>
          );
        },
      });
    });
  }

  if (actions && actions.length) {
    cols.push({
      id: "actions",
      cell: ({ row, table }) => {
        const entity = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-bold text-app-primary bg-app-background text-center">
                الإجراءات
              </DropdownMenuLabel>
              {actions.map((action, i) => {
                return (
                  <Fragment key={i}>
                    {action.type == "delete" && (
                      <DropdownMenuItem
                        className="text-red-600 justify-center hover:text-red-800"
                        onClick={() => {
                          if (action.deleteFuncs) {
                            action.deleteFuncs.setTable(table);
                            action.deleteFuncs.setRow(entity);
                            action.deleteFuncs.setIsDialogOpen(true);
                          }
                        }}
                      >
                        حذف
                      </DropdownMenuItem>
                    )}

                    {action.type == "copy" && (
                      <DropdownMenuItem
                        onClick={() => {
                          if (action.copiedKey)
                            navigator.clipboard.writeText(
                              (entity as Record<string, any>)[action.copiedKey]
                            );
                        }}
                        className="justify-center"
                      >
                        {action.copiedText ? action.copiedText : "نسخ"}
                      </DropdownMenuItem>
                    )}

                    {action.type == "navigate" && action.link != undefined && (
                      <DropdownMenuItem className="justify-center">
                        {action.link.type == "view" && (
                          <Link
                            href={
                              action.link.href + "/" + entity.id!.toString()
                            }
                          >
                            {action.link.text}
                          </Link>
                        )}

                        {action.link.type == "edit" && (
                          <Link
                            href={
                              action.link.href +
                              "/" +
                              entity.id!.toString() +
                              "/edit"
                            }
                          >
                            {action.link.text}
                          </Link>
                        )}
                      </DropdownMenuItem>
                    )}

                    {actions[i + 1] !== undefined && <DropdownMenuSeparator />}
                  </Fragment>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return cols;
}
