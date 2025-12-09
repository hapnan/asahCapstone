import { createFileRoute } from "@tanstack/react-router";
import FollowUpTaskPage from "@/app/task/page";

export const Route = createFileRoute("/__authenticated/_layout/task")({
  component: FollowUpTaskPage,
});
