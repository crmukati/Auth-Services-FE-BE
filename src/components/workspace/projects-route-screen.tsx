"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Folder,
  FolderPlus,
  Grid2X2,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { PromptBox } from "@/components/common/prompt-box";
import { WorkspaceRouteShell } from "@/components/workspace/workspace-route-shell";
import { WorkspaceProjects } from "@/components/workspace/workspace-projects";

const folders = [
  { name: "setup", href: "/dashboard/projects/folders/setup" },
  { name: "testing", href: "/dashboard/projects/folders/testing" },
  { name: "New folder", href: "/dashboard/projects/folders/new-folder" },
];

const folderProjects: Record<string, { name: string; edited: string }[]> = {
  demo: [{ name: "Demo Storefront", edited: "Edited 2 minutes ago" }],
  testing: [{ name: "Your Digital Storefront", edited: "Edited 5 minutes ago" }],
};

const folderChildren: Record<string, { name: string; href: string }[]> = {
  setup: [{ name: "demo", href: "/dashboard/projects/folders/demo" }],
};

const existingProjects = [
  { id: "proj_001", name: "Your Digital Storefront", folderName: "testing", privacy: "Private", theme: "blank" },
  { id: "proj_002", name: "Your Online Shop", folderName: null, privacy: "Private", theme: "shop" },
  { id: "proj_003", name: "Shopify Delight", folderName: null, privacy: "Private", theme: "minimal" },
  { id: "proj_004", name: "Seamless Checkout Flow", folderName: null, privacy: "Private", theme: "store" },
];

export function ProjectsRouteScreen() {
  return (
    <WorkspaceRouteShell>
      <div className="projects-route">
        <header className="projects-route__header">
          <h1>Projects</h1>
          <button type="button">
            Create
            <ChevronDown className="h-4 w-4" />
          </button>
        </header>
        <div className="projects-route__toolbar">
          <label>
            <Search className="h-4 w-4" />
            <input placeholder="Search projects..." />
          </label>
          <select defaultValue="Last edited">
            <option>Last edited</option>
          </select>
          <select defaultValue="Any visibility">
            <option>Any visibility</option>
          </select>
          <select defaultValue="Any status">
            <option>Any status</option>
          </select>
          <select defaultValue="All creators">
            <option>All creators</option>
          </select>
          <button className="active" type="button" aria-label="Filters">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Focus">
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button className="active" type="button" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button type="button" aria-label="List view">
            <List className="h-4 w-4" />
          </button>
        </div>
        <div className="projects-route__folders">
          {folders.map((folder) => (
            <Link href={folder.href} key={folder.name}>
              <Folder className="h-5 w-5" />
              <span>{folder.name}</span>
            </Link>
          ))}
        </div>
        <p className="projects-route__empty">No projects found</p>
      </div>
    </WorkspaceRouteShell>
  );
}

export function FolderRouteScreen({ folderId, folderName }: { folderId: string; folderName: string }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<"subfolder" | "existing" | null>(null);
  const projects = folderProjects[folderName] ?? [];
  const childFolders = folderChildren[folderName] ?? [];
  const hasContent = projects.length > 0 || childFolders.length > 0;

  const createProject = () => {
    router.push(`/dashboard/projects/proj-${Date.now()}?folderId=${folderId}`);
  };

  return (
    <WorkspaceRouteShell activeFolder={folderName}>
      <div className="folder-route">
        <header className="folder-route__header">
          <Link href="/dashboard/projects" aria-label="Back to projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Folder className="h-6 w-6" />
          <h1>{folderName}</h1>
          <button type="button" aria-label="Folder actions">
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {hasContent ? (
            <button className="folder-route__new-project" type="button" onClick={createProject}>
              <Plus className="h-4 w-4" />
              New project
            </button>
          ) : null}
        </header>
        {hasContent ? (
          <FolderProjectContent childFolders={childFolders} folderName={folderName} projects={projects} />
        ) : (
          <div className="folder-route__empty">
            <Folder className="h-16 w-16" />
            <h2>This folder is empty</h2>
            <p>Create new projects, add existing ones, or create subfolders to organize your work.</p>
            <div>
              <button className="primary" type="button" onClick={createProject}>
                <Plus className="h-4 w-4" />
                New project
              </button>
              <button type="button" onClick={() => setOpenModal("existing")}>
                <Plus className="h-4 w-4" />
                Add existing
              </button>
              <button type="button" onClick={() => setOpenModal("subfolder")}>
                <Folder className="h-4 w-4" />
                Create subfolder
              </button>
            </div>
          </div>
        )}
        {openModal === "subfolder" ? (
          <CreateSubfolderModal folderName={folderName} onClose={() => setOpenModal(null)} />
        ) : null}
        {openModal === "existing" ? <AddExistingProjectsModal folderName={folderName} onClose={() => setOpenModal(null)} /> : null}
      </div>
    </WorkspaceRouteShell>
  );
}

function FolderProjectContent({
  childFolders,
  folderName,
  projects,
}: {
  childFolders: { name: string; href: string }[];
  folderName: string;
  projects: { name: string; edited: string }[];
}) {
  return (
    <div className="folder-content-route">
      <div className="folder-content-route__toolbar">
        <label>
          <Search className="h-4 w-4" />
          <input placeholder={`Search projects in ${folderName}...`} />
        </label>
        <select defaultValue="Last edited">
          <option>Last edited</option>
        </select>
        <select defaultValue="Any visibility">
          <option>Any visibility</option>
        </select>
        <select defaultValue="Any status">
          <option>Any status</option>
        </select>
        <select defaultValue="All creators">
          <option>All creators</option>
        </select>
        <button type="button" aria-label="Focus">
          <Grid2X2 className="h-4 w-4" />
        </button>
        <button className="active" type="button" aria-label="Grid view">
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button type="button" aria-label="List view">
          <List className="h-4 w-4" />
        </button>
      </div>
      {childFolders.length > 0 ? (
        <div className="folder-content-route__folders">
          {childFolders.map((folder) => (
            <Link href={folder.href} key={folder.name}>
              <Folder className="h-5 w-5" />
              <span>{folder.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
      <div className="folder-content-route__grid">
        {projects.map((project) => (
          <article className="folder-project-card" key={project.name}>
            <div className="folder-project-card__thumb">
              <span />
            </div>
            <div className="folder-project-card__meta">
              <span>R</span>
              <div>
                <h2>{project.name}</h2>
                <p>{project.edited}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailRouteScreen({ folderId, projectId }: { folderId?: string; projectId: string }) {
  const projectName = projectId.replace(/^proj-/, "Project ");

  return (
    <WorkspaceRouteShell>
      <div className="project-dashboard-route">
        <div className="workspace-hero">
          <button className="hero-pill hero-pill--workspace" type="button">
            <span>New</span>
            Workspace skills - Create your first skill
            <span aria-hidden>-&gt;</span>
          </button>
          <h1>What&apos;s on your mind, Rahul?</h1>
          <PromptBox
            className="workspace-prompt"
            placeholder={folderId ? `Ask Lovable to build ${projectName} in this folder...` : `Ask Lovable to build ${projectName}...`}
          />
        </div>
        <WorkspaceProjects />
      </div>
    </WorkspaceRouteShell>
  );
}

function CreateSubfolderModal({ folderName, onClose }: { folderName: string; onClose: () => void }) {
  return (
    <div className="workspace-modal-overlay">
      <section className="create-folder-modal create-folder-modal--subfolder" aria-label="Create subfolder">
        <button className="create-folder-modal__close" type="button" aria-label="Close create subfolder" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        <h2>Create subfolder</h2>
        <p>
          Create a subfolder inside <span>&quot;{folderName}&quot;</span>
        </p>
        <label className="create-folder-modal__input create-folder-modal__input--focused">
          <Folder className="h-5 w-5" />
          <input autoFocus placeholder="e.g. Side Projects" />
        </label>
        <div className="create-folder-modal__visibility create-folder-modal__visibility--disabled">
          <strong>Visibility</strong>
          <span>Subfolder inherits visibility from the parent folder.</span>
          <label className="selected">
            <input checked disabled type="radio" readOnly />
            <span>
              <b>
                <Users className="h-4 w-4" />
                Workspace
              </b>
              <small>All workspace members can see and add projects to this folder</small>
            </span>
          </label>
          <label>
            <input disabled type="radio" readOnly />
            <span>
              <b>
                <FolderPlus className="h-4 w-4" />
                Personal
              </b>
              <small>Only you can see and add projects to this folder</small>
            </span>
          </label>
        </div>
        <div className="create-folder-modal__footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={onClose}>
            Create
          </button>
        </div>
      </section>
    </div>
  );
}

function AddExistingProjectsModal({ folderName, onClose }: { folderName: string; onClose: () => void }) {
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const toggleProject = (projectId: string) => {
    setSelectedProjectIds((current) =>
      current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId],
    );
  };

  return (
    <div className="workspace-modal-overlay">
      <section className="add-existing-modal" aria-label="Add projects to folder">
        <button className="add-existing-modal__close" type="button" aria-label="Close add projects" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        <h2>Add projects to folder</h2>
        <p>Select projects to add to this folder. A project can only be in one folder at a time.</p>
        <label className="add-existing-modal__search">
          <Search className="h-4 w-4" />
          <input autoFocus placeholder="Search projects..." />
        </label>
        <div className="add-existing-modal__list">
          {existingProjects.map((project) => (
            <button className="add-existing-modal__project" type="button" key={project.id} onClick={() => toggleProject(project.id)}>
              <span className={`add-existing-modal__thumb add-existing-modal__thumb--${project.theme}`} />
              <span className="add-existing-modal__project-text">
                <strong>
                  {project.name}
                  <small>{project.privacy}</small>
                </strong>
                {project.folderName ? (
                  <em>
                    <Folder className="h-3 w-3" />
                    {project.folderName === folderName ? folderName : project.folderName}
                  </em>
                ) : null}
              </span>
              <span className={selectedProjectIds.includes(project.id) ? "add-existing-modal__check checked" : "add-existing-modal__check"} />
            </button>
          ))}
        </div>
        <div className="add-existing-modal__footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={onClose}>
            Add {selectedProjectIds.length} projects
          </button>
        </div>
      </section>
    </div>
  );
}
