import { useState, useEffect, useId, useMemo } from "react";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconLayoutColumns,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { DraggableRow } from "./draggable-row";
import { customerAPI, predictionAPI } from "@/lib/api";
/**
 * MAIN COMPONENT
 * Fully identical to original logic
 */
export function DataTable({
  data: initialData,
  columns,
  enableDrag = false,
  enableSelect = false,
  enableTabs = false,
  tabs = [],
}) {
  // -------------------------------------------------------------------------
  // STATE
  // -------------------------------------------------------------------------
  const [data, setData] = useState(() => initialData);
  const [activeTab, setActiveTab] = useState(tabs[0]?.value ?? "all");
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter Dialog States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");

  // Prediction Progress States
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState({
    current: 0,
    total: 0,
  });

  const sortableId = useId();

  // -------------------------------------------------------------------------
  // DND SENSORS
  // -------------------------------------------------------------------------
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const filteredData = useMemo(() => {
    let result = data;

    // Apply tab filtering
    if (enableTabs) {
      const tabInfo = tabs.find((t) => t.value === activeTab);
      if (tabInfo && tabInfo.filterFn) {
        result = result.filter(tabInfo.filterFn);
      }
    }

    // Apply score range filtering (percentage-based)
    if (minScore !== "" || maxScore !== "") {
      result = result.filter((item) => {
        const score = item.predict?.[0]?.predictive_score_subscribe;
        if (score === undefined || score === null) return false;

        // Convert percentage input to decimal (e.g., 50 -> 0.5)
        const min = minScore === "" ? -Infinity : parseFloat(minScore) / 100;
        const max = maxScore === "" ? Infinity : parseFloat(maxScore) / 100;

        return score >= min && score <= max;
      });
    }

    // Apply sorting
    if (sortField) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        // Handle string comparison for name
        if (sortField === "name") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        }

        // Handle numeric comparison
        if (sortField === "predictive_score_subscribe") {
          aVal = parseFloat(a.predict?.[0]?.predictive_score_subscribe) || 0;
          bVal = parseFloat(b.predict?.[0]?.predictive_score_subscribe) || 0;
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [
    data,
    activeTab,
    enableTabs,
    tabs,
    minScore,
    maxScore,
    sortField,
    sortOrder,
  ]);

  const finalColumns = useMemo(() => {
    let cols = [...columns];
    if (!enableDrag) cols = cols.filter((c) => c.id !== "drag");
    if (!enableSelect) cols = cols.filter((c) => c.id !== "select");

    return cols;
  }, [columns, enableDrag, enableSelect]);

  // const dataIds = useMemo(() => data?.map(({ id }) => id) || [], [data]);
  // -------------------------------------------------------------------------
  // TABLE INITIALIZATION
  // -------------------------------------------------------------------------
  const table = useReactTable({
    data: filteredData,
    columns: finalColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),

    enableRowSelection: true,

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const paginatedRows = table.getPaginationRowModel().rows;
  const visibleRowIds = paginatedRows.map((r) => r.id);

  useEffect(() => {
    const pageCount = table.getPageCount();
    if (pagination.pageIndex >= pageCount) {
      setPagination((p) => ({ ...p, pageIndex: Math.max(0, pageCount - 1) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData.length]);

  // -------------------------------------------------------------------------
  // FILTER HANDLERS
  // -------------------------------------------------------------------------
  const handleApplyFilter = () => {
    setIsFilterOpen(false);
    // Reset to first page when filter is applied
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const handleResetFilter = () => {
    setSortField("");
    setSortOrder("asc");
    setMinScore("");
    setMaxScore("");
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  // -------------------------------------------------------------------------
  // DND HANDLER (fully original)
  // -------------------------------------------------------------------------
  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;

    setData((prev) => {
      const currentVisible = paginatedRows.map((r) => r.id);

      const oldLocal = currentVisible.indexOf(active.id);
      const newLocal = currentVisible.indexOf(over.id);

      // if either is not in current page, abort (we only allow reorders inside same page)
      if (oldLocal === -1 || newLocal === -1) return prev;

      // map local visible position to global index in `prev` data array
      const oldGlobal = prev.findIndex(
        (item) => item.id.toString() === active.id,
      );
      const newGlobal = prev.findIndex(
        (item) => item.id.toString() === over.id,
      );

      // safety: if not found, abort
      if (oldGlobal === -1 || newGlobal === -1) return prev;

      // // if nothing changes, return prev
      // if (oldGlobal === newGlobal) return prev;

      const next = arrayMove(prev, oldGlobal, newGlobal);

      return next;
    });
  }

  /// predict function with batch processing
  async function predict() {
    setIsPredicting(true);
    setPredictionProgress({ current: 0, total: 0 });

    try {
      const customerResponse = await customerAPI.getAllCustomersFull();
      const customer = await customerResponse.json();

      if (!customer || customer.length === 0) {
        console.error("No customer data available for prediction.");
        setIsPredicting(false);
        return;
      }

      console.log(
        `Starting batch prediction for ${customer.length} customers...`,
      );

      // Log sample data structure for debugging
      if (customer.length > 0) {
        console.log(
          "Sample customer data structure:",
          JSON.stringify(customer[0], null, 2),
        );
      }

      // Use batch prediction with progress tracking
      // Adjust chunk size based on your needs (500 is a safe default)
      const response = await predictionAPI.getPredictionBatch(
        customer,
        500,
        (current, total) => {
          setPredictionProgress({ current, total });
          console.log(`Processing batch ${current} of ${total}...`);
        },
      );

      // Update the table data with the new prediction results
      if (response && Array.isArray(response)) {
        const newCustomerResponse = await customerAPI.getAllCustomers();
        const newCustomer = await newCustomerResponse.json();
        setData(newCustomer);
        // Reset to first page after data update
        setPagination((p) => ({ ...p, pageIndex: 0 }));
        console.log(
          `Prediction completed successfully for ${response.length} customers`,
        );
      }

      return response;
    } catch (error) {
      console.error("Prediction failed:", error);
      alert(`Prediction failed: ${error.message}`);
      throw error;
    } finally {
      setIsPredicting(false);
      setPredictionProgress({ current: 0, total: 0 });
    }
  }

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-4 w-full px-7">
      {/* =============== TABS IF ENABLED =============== */}
      <div className="flex justify-between w-full">
        {enableTabs && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* CONTENT WRAPPER */}
            {/* <TabsContent value={activeTab}> */}
            {/* Table will render below */}
            {/* </TabsContent> */}
          </Tabs>
        )}

        {/* =============== HEADER CONTROLS =============== */}
        <div className="flex items-center gap-2 px-4">
          {/* Customize Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => predict()}
            disabled={isPredicting}
          >
            {isPredicting
              ? predictionProgress.total > 0
                ? `Predicting... ${predictionProgress.current}/${predictionProgress.total}`
                : "Predicting..."
              : "Predict"}
          </Button>

          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <IconAdjustmentsHorizontal /> Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Filter & Sort Data</DialogTitle>
                <DialogDescription>
                  Atur sorting dan filtering untuk tabel data
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Sorting Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Sorting</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sortField">Sort By</Label>
                      <Select value={sortField} onValueChange={setSortField}>
                        <SelectTrigger id="sortField">
                          <SelectValue placeholder="Pilih field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="predictive_score_subscribe">
                            Predictive Score
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Order</Label>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger id="sortOrder">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Filtering Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">
                    Filter by Predictive Score Range (%)
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minScore">Minimum Score (%)</Label>
                      <Input
                        id="minScore"
                        type="number"
                        placeholder="0"
                        value={minScore}
                        onChange={(e) => setMinScore(e.target.value)}
                        step="1"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxScore">Maximum Score (%)</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        placeholder="100"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        step="1"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleResetFilter}>
                  Reset
                </Button>
                <Button onClick={handleApplyFilter}>Apply Filter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* =============== TABLE WRAPPER =============== */}
      <div className="overflow-hidden rounded-lg border">
        {enableDrag ? (
          // ---------- With Drag ----------
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            id={sortableId}
          >
            <Table key={finalColumns.map((c) => c.id).join("_")}>
              {/* Header */}
              <TableHeader className="sticky top-0 bg-muted z-10">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              {/* Body with draggable row */}
              <TableBody>
                <SortableContext
                  items={visibleRowIds}
                  strategy={verticalListSortingStrategy}
                  key={JSON.stringify({
                    sel: table.getState().rowSelection,
                    vis: table.getState().columnVisibility,
                  })}
                >
                  {paginatedRows.length ? (
                    paginatedRows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={finalColumns.length}
                        className="text-center py-6"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        ) : (
          // ---------- No Drag ----------
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {paginatedRows.length ? (
                paginatedRows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={finalColumns.length}
                    className="text-center py-6"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* =============== PAGINATION =============== */}
      <div className="flex justify-between px-4 items-center">
        {/* Rows per page */}
        <div className="hidden lg:flex items-center gap-2">
          <Label>Rows</Label>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page count */}
        <div className="text-sm font-medium">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
