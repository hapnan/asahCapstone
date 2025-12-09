import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
} from "lucide-react";
import data from "./data.json";

export default function CalloutHistoryPage() {
  const [callouts] = useState(data.calloutHistory);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter callouts based on status and search
  const filteredCallouts = callouts.filter((callout) => {
    const matchesStatus =
      filterStatus === "all" || callout.orderStatus === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      callout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      callout.phoneNumber.includes(searchQuery) ||
      callout.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get statistics
  const willSubscribe = callouts.filter(
    (c) => c.orderStatus === "Akan berlangganan"
  ).length;
  const thinking = callouts.filter(
    (c) => c.orderStatus === "Masih memikirkan"
  ).length;
  const skipped = callouts.filter(
    (c) => c.orderStatus === "Pelanggan skip"
  ).length;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Akan berlangganan":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Masih memikirkan":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Pelanggan skip":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Callout History</h1>
          <p className="text-muted-foreground mt-1">
            Riwayat panggilan dan status pemesanan pelanggan
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Callouts
                </p>
                <p className="text-3xl font-bold mt-1">{callouts.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Akan Berlangganan
                </p>
                <p className="text-3xl font-bold mt-1">{willSubscribe}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Masih Memikirkan
                </p>
                <p className="text-3xl font-bold mt-1">{thinking}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pelanggan Skip
                </p>
                <p className="text-3xl font-bold mt-1">{skipped}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Akan berlangganan">
                    Akan Berlangganan
                  </SelectItem>
                  <SelectItem value="Masih memikirkan">
                    Masih Memikirkan
                  </SelectItem>
                  <SelectItem value="Pelanggan skip">Pelanggan Skip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Callout History List</CardTitle>
          <CardDescription>
            Daftar riwayat panggilan pelanggan
            {filterStatus !== "all" && ` dengan status ${filterStatus}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Status Pemesanan</TableHead>
                <TableHead>Waktu Ditelpon</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCallouts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No callout history found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCallouts.map((callout) => (
                  <TableRow key={callout.id}>
                    <TableCell>
                      <div className="font-medium">{callout.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {callout.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{callout.phoneNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(callout.orderStatus)}>
                        {callout.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateTime(callout.callTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate" title={callout.notes}>
                        {callout.notes}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
