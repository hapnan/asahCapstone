import { useState, useEffect } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useIsMobile } from "@/hooks/use-mobile";
import { customerAPI, reportAPI } from "@/lib/api";
import { toast } from "sonner";

export default function TableCellViewer({ item }) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(item); // default = basic row data
  const [loading, setLoading] = useState(false);

  // FETCH DETAIL ONLY WHEN DRAWER OPENS
  useEffect(() => {
    if (!open) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await customerAPI.getcustomerById(item.id);
        const data = await res.json();
        setDetail(data); // <- put API result here
      } catch (err) {
        console.error("Failed to load customer detail: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, item.id]);

  async function handleButton(status, id) {
    if (status === "accept") {
      const res = await reportAPI.addReport({
        id_customer: id,
        status: "success",
      });

      if (!res.ok) {
        toast.error("Failed to add to db");
        return;
      }
      const data = await res.json();

      data
        ? toast.success("Customer accepted ")
        : toast.error("Failed to add to db");
    } else if (status === "reject") {
      const res = await reportAPI.addReport({
        customer_id: id,
        action: "failure",
      });

      if (!res.ok) {
        toast.error("Failed to adding to db");
        return;
      }
      const data = await res.json();
      data
        ? toast.success("Customer rejected ")
        : toast.error("Failed to adding to db");
    } else {
      const res = await reportAPI.addReport({
        customer_id: id,
        action: "nonexistent",
      });
      if (!res.ok) {
        toast.error("Failed to adding to db");
        return;
      }
      const data = await res.json();
      data
        ? toast.success("Customer nonexistent ")
        : toast.error("Failed to adding to db");
    }
  }

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left cursor-pointer font-medium"
        >
          {item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>{detail.name}</DrawerTitle>
          <DrawerDescription>
            Detail customer profiling & campaign info
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 px-4 py-2 overflow-y-auto text-sm">
          {loading && (
            <>
              {/* BASIC INFORMATION SKELETON */}
              <section className="space-y-3">
                <Skeleton className="h-5 w-[160px]" />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <Skeleton className="h-3 w-[80px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* CONTACT HISTORY SKELETON */}
              <section className="space-y-3">
                <Skeleton className="h-5 w-[140px]" />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <Skeleton className="h-3 w-[100px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* CAMPAIGN RESULT SKELETON */}
              <section className="space-y-3">
                <Skeleton className="h-5 w-[150px]" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-[120px]" />
                    <Skeleton className="h-4 w-[90px]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-[130px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-[110px]" />
                    <Skeleton className="h-4 w-[70px]" />
                  </div>
                </div>
              </section>
            </>
          )}

          {!loading && (
            <>
              {/* BASIC INFORMATION */}
              <section className="space-y-3">
                <h3 className="font-semibold text-base">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Info label="Age" value={detail.age} />
                  <Info label="Job" value={detail.job} />
                  <Info label="Education" value={detail.education} />
                  <Info label="Marital" value={detail.marital} />
                  <Info label="Has Credit" value={detail.has_credit} />
                  <Info
                    label="Housing Loan"
                    value={detail.housing_loan}
                    capitalize
                  />
                  <Info
                    label="Personal Loan"
                    value={detail.personal_loan}
                    capitalize
                  />
                  <Info
                    label="Contacted Via"
                    value={detail.contact_comunication}
                    capitalize
                  />
                </div>
              </section>

              <Separator />

              {/* CONTACT HISTORY */}
              <section className="space-y-3">
                <h3 className="font-semibold text-base">Contact History</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Info label="Last Day" value={detail.last_day_contacted} />
                  <Info
                    label="Last Month"
                    value={detail.last_month_contacted}
                  />
                  <Info
                    label="Times Contacted (Now)"
                    value={detail.how_many_contacted_now}
                  />
                  <Info
                    label="Times Contacted (Prev.)"
                    value={detail.how_many_contacted_previous}
                  />
                  <Info
                    label="Days After Last Contact"
                    value={detail.days_last_contacted}
                  />
                </div>
              </section>

              <Separator />

              {/* CAMPAIGN RESULT */}
              <section className="space-y-3">
                <h3 className="font-semibold text-base">Campaign Result</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Info
                    label="Last Campaign Result"
                    value={detail.result_of_last_campaign}
                    capitalize
                  />

                  <div className="flex flex-col">
                    <Label className="text-xs text-muted-foreground">
                      Predictive Subscribe
                    </Label>
                    <Badge className="w-fit px-2 capitalize" variant="outline">
                      {detail.predict?.[0]?.predictive_subscribe || "N/A"}
                    </Badge>
                  </div>

                  <Info
                    label="Subscribe Score"
                    value={
                      detail.predict?.[0]?.predictive_score_subscribe
                        ? (
                            detail.predict[0].predictive_score_subscribe * 100
                          ).toFixed(1) + "%"
                        : "N/A"
                    }
                  />
                </div>
              </section>
            </>
          )}
        </div>

        <DrawerFooter>
          <div className="w-full flex flex-row gap-2.5">
            <Button
              variant="default"
              onClick={() => handleButton("accept", detail.id)}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              variant="default"
              onClick={() => handleButton("panding", detail.id)}
              className="flex-1"
            >
              Non Existent
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleButton("reject", detail.id)}
            >
              Reject
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Info({ label, value, capitalize }) {
  return (
    <div className="flex flex-col">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <span className={capitalize ? "capitalize" : ""}>{value}</span>
    </div>
  );
}
