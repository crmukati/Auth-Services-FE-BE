"use client";

import { useState } from "react";
import { PromptBox } from "@/components/common/prompt-box";
import { WorkspaceProjects } from "@/components/workspace/workspace-projects";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

export function LoggedWorkspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <main className={sidebarCollapsed ? "workspace workspace--collapsed" : "workspace"}>
      <WorkspaceSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)} />
      <section className="workspace-main">
        <div className="workspace-hero">
          <button className="hero-pill hero-pill--workspace" type="button">
            <span>New</span>
            Workspace skills - Create your first skill
            <span aria-hidden>-&gt;</span>
          </button>
          <h1>What&apos;s on your mind, Rahul?</h1>
          <PromptBox className="workspace-prompt" placeholder="Ask Lovable to create a presentation about..." />
        </div>
        <WorkspaceProjects />
      </section>
    </main>
  );
}
