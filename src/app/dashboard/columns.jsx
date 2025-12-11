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

import { IconPhone } from "@tabler/icons-react";

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
    cell: ({ row }) => {
      const prediction = row.original.predict?.[0]?.predictive_subscribe;
      return !prediction ? (
        <Badge
          className={`px-2 capitalize border bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300`}
        >
          unknown
        </Badge>
      ) : (
        <Badge
          className={`px-2 capitalize border ${subscribeColor[prediction]}`}
        >
          {prediction}
        </Badge>
      );
    },
  },

  // ====================================================================
  // SCORE (RIGHT ALIGNED)
  // ====================================================================
  {
    accessorKey: "predictive_score_subscribe",
    header: () => <div className="text-right pr-2">Score</div>,
    cell: ({ row }) => {
      const score = row.original.predict?.[0]?.predictive_score_subscribe;
      return (
        <div className="text-right pr-2 font-medium">
          {!score ? "N/A" : (score * 100).toFixed(1) + "%"}
        </div>
      );
    },
  },

  // ====================================================================
  // ACTIONS MENU (EDIT / DELETE)
  // ====================================================================
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <div className="w-full flex justify-center">
        <Button variant="secondary">
          <IconPhone size={18} /> Call
        </Button>
      </div>
    ),
  },
];
