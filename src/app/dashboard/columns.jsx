import { DragHandle } from "@/components/data-table/drag-handle";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import TableCellViewer from "@/components/data-table/table-cell-viewer-dashboard";

import { IconDotsVertical } from "@tabler/icons-react";

// OPTIONAL: Color helpers for predictive status
const subscribeColor = {
  failure:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
  nonexistent:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300",
  success:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300",
};

export const columns = [
  // ====================================================================
  // DRAG COLUMN
  // ====================================================================
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.id} />,
    enableSorting: false,
    enableHiding: false,
  },

  // ====================================================================
  // SELECT CHECKBOX COLUMN
  // ====================================================================
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ====================================================================
  // NAME
  // ====================================================================
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
  },

  // ====================================================================
  // JOB
  // ====================================================================
  {
    accessorKey: "job",
    header: "Job",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-2">
        {row.original.job}
      </Badge>
    ),
  },

  // ====================================================================
  // LAST CAMPAIGN RESULT
  // ====================================================================
  {
    accessorKey: "result_of_last_campaign",
    header: "Last Campaign",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 text-muted-foreground">
        {row.original.result_of_last_campaign}
      </Badge>
    ),
  },

  // ====================================================================
  // PREDICTIVE SUBSCRIBE
  // ====================================================================
  {
    accessorKey: "predictive_subscribe",
    header: "Prediction",
    cell: ({ row }) => (
      <Badge
        className={`px-2 capitalize border ${subscribeColor[row.original.predictive_subscribe]}`}
      >
        {row.original.predictive_subscribe}
      </Badge>
    ),
  },

  // ====================================================================
  // SCORE (RIGHT ALIGNED)
  // ====================================================================
  {
    accessorKey: "predictive_score_subscribe",
    header: () => <div className="text-right pr-2">Score</div>,
    cell: ({ row }) => (
      <div className="text-right pr-2 font-medium">
        {(row.original.predictive_score_subscribe * 100).toFixed(1)}%
      </div>
    ),
  },

  // ====================================================================
  // ACTIONS MENU (EDIT / DELETE)
  // ====================================================================
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 p-0 flex items-center justify-center text-muted-foreground"
          >
            <IconDotsVertical size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
