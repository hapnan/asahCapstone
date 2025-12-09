import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/dashboard/page";

export const Route = createFileRoute("/__authenticated/_layout/")({
  component: Dashboard,
});
