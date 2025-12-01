import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/__authenticated/_layout")({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "280px",
        "--header-height": "60px",
      }}
      className="min-h-screen w-full"
    >
      <AppSidebar variant="inset" />

      <SidebarInset className="flex-1">
        <SiteHeader />

        {/* Semua halaman anak akan tampil di sini */}
        <Outlet />
        {/* <div className="flex flex-1 flex-col w-full p-4">
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
