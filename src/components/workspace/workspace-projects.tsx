"use client";

import { Copy, Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export const projectTabs = ["My projects", "Recently viewed", "Shared with me", "Lovable templates"] as const;

export type ProjectTab = (typeof projectTabs)[number];

type WorkspaceProject = {
  title: string;
  edited: string;
  theme: string;
  tab: ProjectTab;
  screens: string[];
};

const projects: WorkspaceProject[] = [
  {
    title: "Your Online Shop",
    edited: "Edited 5 days ago",
    theme: "goods",
    tab: "My projects",
    screens: ["Home", "Shop", "Product detail", "Cart", "Checkout"],
  },
  {
    title: "Shopify Delight",
    edited: "Edited 7 days ago",
    theme: "objects",
    tab: "My projects",
    screens: ["Home", "Collection", "Journal", "Product detail"],
  },
  {
    title: "Seamless Checkout Flow",
    edited: "Edited 29 days ago",
    theme: "fashion",
    tab: "My projects",
    screens: ["Home", "Spring edit", "Catalog", "Checkout"],
  },
  {
    title: "Your Creative Spark",
    edited: "Viewed today",
    theme: "dashboard",
    tab: "Recently viewed",
    screens: ["Dashboard", "Prompts", "Collections", "Settings"],
  },
  {
    title: "Tokenized Assets Hub",
    edited: "Viewed yesterday",
    theme: "luxury",
    tab: "Recently viewed",
    screens: ["Overview", "Assets", "Transactions", "Wallet"],
  },
  {
    title: "Shopify Delight",
    edited: "Viewed 3 days ago",
    theme: "objects",
    tab: "Recently viewed",
    screens: ["Home", "Collection", "Journal", "Product detail"],
  },
  {
    title: "Seamless Checkout Flow",
    edited: "Shared 2 weeks ago",
    theme: "fashion",
    tab: "Shared with me",
    screens: ["Home", "Spring edit", "Catalog", "Checkout"],
  },
  {
    title: "Glimmer Gold",
    edited: "Shared 1 month ago",
    theme: "luxury",
    tab: "Shared with me",
    screens: ["Landing", "Collections", "Lookbook", "Contact"],
  },
  {
    title: "Prompt Library",
    edited: "Shared 2 months ago",
    theme: "dashboard",
    tab: "Shared with me",
    screens: ["Library", "Prompt detail", "Categories", "Settings"],
  },
  {
    title: "Clean Storefront",
    edited: "Template",
    theme: "blank",
    tab: "Lovable templates",
    screens: ["Home", "About", "Contact"],
  },
  {
    title: "Atelier Landing",
    edited: "Template",
    theme: "goods",
    tab: "Lovable templates",
    screens: ["Landing", "Shop", "Product detail"],
  },
  {
    title: "Maison Collection",
    edited: "Template",
    theme: "objects",
    tab: "Lovable templates",
    screens: ["Home", "Journal", "Collection"],
  },
];

export function WorkspaceProjects() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("My projects");
  const [menuProject, setMenuProject] = useState<WorkspaceProject | null>(null);
  const [screensProject, setScreensProject] = useState<WorkspaceProject | null>(null);
  const visibleProjects = useMemo(() => projects.filter((project) => project.tab === activeTab).slice(0, 3), [activeTab]);

  return (
    <section className="workspace-projects">
      <div className="workspace-projects__bar">
        <div className="project-tabs">
          {projectTabs.map((tab) => (
            <button className={activeTab === tab ? "active" : undefined} type="button" key={tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <button className="text-sm font-medium" type="button">
          Browse all -&gt;
        </button>
      </div>
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <article className="project-card" key={`${project.tab}-${project.title}`}>
            <div className={`project-thumb project-thumb--${project.theme}`}>
              <span />
            </div>
            <div className="project-meta">
              <span>R</span>
              <div>
                <h3>{project.title}</h3>
                <p>{project.edited}</p>
              </div>
              <button
                className="project-card__menu-button"
                type="button"
                aria-label={`Open ${project.title} actions`}
                onClick={() => setMenuProject((current) => (current?.title === project.title ? null : project))}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {menuProject?.title === project.title ? (
                <ProjectCrudMenu
                  onViewScreens={() => {
                    setScreensProject(project);
                    setMenuProject(null);
                  }}
                />
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {screensProject ? <ProjectScreensPanel project={screensProject} onClose={() => setScreensProject(null)} /> : null}
    </section>
  );
}

function ProjectCrudMenu({ onViewScreens }: { onViewScreens: () => void }) {
  return (
    <div className="project-crud-menu">
      <button type="button" onClick={onViewScreens}>
        <Eye className="h-4 w-4" />
        View screens
      </button>
      <button type="button">
        <Pencil className="h-4 w-4" />
        Rename
      </button>
      <button type="button">
        <Copy className="h-4 w-4" />
        Duplicate
      </button>
      <button className="danger" type="button">
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}

function ProjectScreensPanel({ project, onClose }: { project: WorkspaceProject; onClose: () => void }) {
  return (
    <div className="project-screens-panel">
      <div className="project-screens-panel__header">
        <div>
          <p>Project screens</p>
          <h2>{project.title}</h2>
        </div>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="project-screens-panel__list">
        {project.screens.map((screen) => (
          <button type="button" key={screen}>
            <span>{screen.slice(0, 1)}</span>
            <div>
              <strong>{screen}</strong>
              <p>Open {screen.toLowerCase()} screen</p>
            </div>
          </button>
        ))}
      </div>
      <button className="project-screens-panel__create" type="button">
        <Plus className="h-4 w-4" />
        Add screen
      </button>
    </div>
  );
}
