import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table/dataTable";
import { SectionCards } from "@/components/section-cards";
import { LoadingSkeleton } from "@/components/loading-skeleton";
// import { columns } from "@/components/data-table/column";
import { columns } from "@/app/dashboard/columns";
import { customerAPI, reportAPI } from "@/lib/api";

// import data from "./data.json";

export default function Page() {
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const customer = await customerAPI.getAllCustomers();
      const data = await customer.json();

      setCustomers(data);
      setLoading(false);
    };

    const fetchAnalitics = async () => {
      const response = await reportAPI.getReportById();
      const analyticsData = await response.json();
      setAnalytics(analyticsData.data);
    };

    fetchAnalitics();
    fetchCustomers();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={analytics} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable
            data={customers}
            columns={columns}
            enableTabs={true}
            enableDrag={false}
            enableSelect={true}
            tabs={[
              { value: "all", label: "All", filterFn: () => true },
              {
                value: "failure",
                label: "Failure",
                filterFn: (row) =>
                  row.predict?.[0]?.predictive_subscribe === "failure",
              },
              {
                value: "nonexistent",
                label: "Nonexistent",
                filterFn: (row) =>
                  row.predict?.[0]?.predictive_subscribe === "nonexistent",
              },
              {
                value: "success",
                label: "Success",
                filterFn: (row) =>
                  row.predict?.[0]?.predictive_subscribe === "success",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
