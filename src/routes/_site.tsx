import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-header";

export const Route = createFileRoute("/_site")({
  component: () => (
    <SiteShell>
      <Outlet />
    </SiteShell>
  ),
});
