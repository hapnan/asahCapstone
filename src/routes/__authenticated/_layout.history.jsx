import { createFileRoute } from "@tanstack/react-router";
import CalloutHistoryPage from "@/app/history/page";

export const Route = createFileRoute("/__authenticated/_layout/history")({
  component: CalloutHistoryPage,
});
