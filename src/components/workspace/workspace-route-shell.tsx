"use client";

import { useState, type ReactNode } from "react";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

type WorkspaceRouteShellProps = {
  children: ReactNode;
  activeFolder?: string;
};

export function WorkspaceRouteShell({ children, activeFolder }: WorkspaceRouteShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <main className={sidebarCollapsed ? "workspace workspace--collapsed workspace--project-route" : "workspace workspace--project-route"}>
      <WorkspaceSidebar activeFolder={activeFolder} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)} />
      <section className="workspace-main workspace-main--plain">{children}</section>
    </main>
  );
}
