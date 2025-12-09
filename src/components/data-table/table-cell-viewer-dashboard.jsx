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

import { useIsMobile } from "@/hooks/use-mobile";
import { customerAPI } from "@/lib/api";

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
            <div className="text-center py-10 text-muted-foreground">
              Loading details...
            </div>
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
                      {detail.predict?.[0].predictive_subscribe}
                    </Badge>
                  </div>

                  <Info
                    label="Subscribe Score"
                    value={
                      (
                        detail.predict?.[0].predictive_score_subscribe * 100
                      ).toFixed(1) + "%"
                    }
                  />
                </div>
              </section>
            </>
          )}
        </div>

        <DrawerFooter>
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
