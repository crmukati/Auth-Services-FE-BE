"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  Gift,
  Folder,
  FolderPlus,
  House,
  Home,
  Inbox,
  Layers3,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  SunMoon,
  UserPlus,
  User,
  LogOut,
  Users,
  X,
  Zap,
} from "lucide-react";
import { LovableLogo } from "@/components/brand/lovable-logo";

type SidebarNavItem = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  hint?: string;
};

type WorkspaceSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  activeFolder?: string;
};

type ProjectTreeItem = {
  folder: string;
  projects: string[];
  subfolders?: ProjectTreeItem[];
};

type ThemeMode = "light" | "dark" | "system";

const navItems: SidebarNavItem[] = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search", hint: "Ctrl K" },
  { icon: Box, label: "Resources" },
  { icon: Share2, label: "Connectors" },
];

const projectItems: SidebarNavItem[] = [
  { icon: Layers3, label: "All projects", active: true },
  { icon: Star, label: "Starred" },
  { icon: User, label: "Created by me" },
  { icon: Users, label: "Shared with me" },
];

const recents: string[] = [];
const initialProjectTree: ProjectTreeItem[] = [
  { folder: "setup", projects: [], subfolders: [{ folder: "demo", projects: ["Demo Storefront"] }] },
  { folder: "testing", projects: ["Your Digital Storefront", "Your Online Shop", "Shopify Delight", "Seamless Checkout Flow"] },
  { folder: "New folder", projects: [] },
];

function WorkspaceNavButton({
  item,
  collapsed,
  projectAction = false,
  onProjectAction,
  onExpandAction,
  onClick,
  expanded,
}: {
  item: SidebarNavItem;
  collapsed: boolean;
  projectAction?: boolean;
  onProjectAction?: (rect: DOMRect) => void;
  onExpandAction?: () => void;
  onClick?: () => void;
  expanded?: boolean;
}) {
  const activeClassName = item.active && !(collapsed && projectAction) ? "workspace-nav workspace-nav--active" : "workspace-nav";

  return (
    <button
      className={activeClassName}
      type="button"
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      onClick={onClick}
    >
      {projectAction && !collapsed ? (
        <span
          className="workspace-nav__expand"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onExpandAction?.();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onExpandAction?.();
            }
          }}
        >
          <ChevronRight className={expanded ? "h-4 w-4 rotate-90" : "h-4 w-4"} />
        </span>
      ) : (
        <item.icon className="h-4 w-4" />
      )}
      <span>{item.label}</span>
      {item.hint ? <span className="workspace-nav__hint">{item.hint}</span> : null}
      {projectAction && !collapsed ? (
        <span
          className="workspace-nav__action"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onProjectAction?.(event.currentTarget.getBoundingClientRect());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onProjectAction?.(event.currentTarget.getBoundingClientRect());
            }
          }}
        >
          <MoreHorizontal className="h-4 w-4 text-neutral-500" />
        </span>
      ) : null}
    </button>
  );
}

export function WorkspaceSidebar({ collapsed, onToggle, activeFolder }: WorkspaceSidebarProps) {
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projectMenuPosition, setProjectMenuPosition] = useState<CSSProperties>();
  const [folderMenu, setFolderMenu] = useState<{ folder: string; position: CSSProperties } | null>(null);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [subfolderModalOpen, setSubfolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [projectTree, setProjectTree] = useState<ProjectTreeItem[]>(initialProjectTree);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [workspaceCreateOpen, setWorkspaceCreateOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("workspace-theme") as ThemeMode | null;

    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      setThemeMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const resolvedTheme = themeMode === "system" ? systemTheme : themeMode;

    document.documentElement.dataset.theme = resolvedTheme;
    window.localStorage.setItem("workspace-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    function closeMenusOnOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const isProjectMenuClick = target.closest(".workspace-inline-menu");
      const isAllProjectsActionClick = target.closest(".workspace-nav__action");
      const isFolderActionClick = target.closest(".workspace-project-tree__action");

      if (isProjectMenuClick || isAllProjectsActionClick || isFolderActionClick) {
        return;
      }

      setProjectMenuOpen(false);
      setFolderMenu(null);

      if (!sidebarRef.current || sidebarRef.current.contains(target)) {
        return;
      }

      setAccountMenuOpen(false);
      setWorkspaceMenuOpen(false);
    }

    document.addEventListener("mousedown", closeMenusOnOutsideClick);

    return () => document.removeEventListener("mousedown", closeMenusOnOutsideClick);
  }, []);

  function toggleSidebar() {
    setAccountMenuOpen(false);
      setWorkspaceMenuOpen(false);
      setProjectMenuOpen(false);
      setFolderMenu(null);
      onToggle();
    }

  function addSubfolder(parentFolder: string, subfolderName: string) {
    setProjectTree((currentTree) => addSubfolderToTree(currentTree, parentFolder, subfolderName));
  }

  function addProject(folderName: string) {
    setProjectTree((currentTree) => addProjectToTree(currentTree, folderName));
  }

  return (
    <aside className="workspace-sidebar" ref={sidebarRef}>
      <div className="workspace-sidebar__top">
        <LovableLogo />
        <button className="workspace-sidebar__toggle" type="button" aria-label="Toggle sidebar" onClick={toggleSidebar}>
          <PanelLeft className="h-4 w-4 text-neutral-600" />
        </button>
      </div>
      <button
        className="workspace-switcher"
        type="button"
        title={collapsed ? "Rahul's Lovable" : undefined}
        onClick={() => {
          setWorkspaceMenuOpen((current) => !current);
          setAccountMenuOpen(false);
        }}
      >
        <span>R</span>
        <b>Rahul&apos;s Lovable</b>
        <ChevronDown className="ml-auto h-4 w-4" />
      </button>
      {workspaceMenuOpen ? (
        <WorkspaceSwitcherMenu
          collapsed={collapsed}
          onCreateWorkspace={() => {
            setWorkspaceMenuOpen(false);
            setWorkspaceCreateOpen(true);
          }}
        />
      ) : null}
      <nav className="workspace-nav-group">
        {navItems.map((item) => (
          <WorkspaceNavButton
            collapsed={collapsed}
            item={item}
            key={item.label}
            onClick={item.label === "Home" ? () => router.push("/dashboard") : undefined}
          />
        ))}
      </nav>
      <div className="workspace-sidebar__scroll">
        <div className="workspace-nav-group workspace-nav-group--projects">
          <p className="workspace-label px-2 text-sm text-neutral-500">Projects</p>
          <WorkspaceNavButton
            collapsed={collapsed}
            item={projectItems[0]}
            projectAction
            onProjectAction={(rect) => {
              setProjectMenuPosition({
                left: rect.left,
                top: rect.bottom + 8,
              });
              setProjectMenuOpen((current) => !current);
              setFolderMenu(null);
            }}
            onExpandAction={() => setProjectsExpanded((current) => !current)}
            onClick={() => {
              router.push("/dashboard/projects");
            }}
            expanded={projectsExpanded}
          />
          {projectMenuOpen ? (
            <AllProjectsMenu
              position={projectMenuPosition}
              onCreateFolder={() => {
                setFolderModalOpen(true);
                setProjectMenuOpen(false);
              }}
              onCreateProject={() => {
                setProjectMenuOpen(false);
                router.push("/dashboard/projects");
              }}
            />
          ) : null}
          {!collapsed && projectsExpanded ? (
            <ProjectTree
              activeFolder={activeFolder}
              items={projectTree}
              onFolderAction={(folder, rect) => {
                setFolderMenu({
                  folder,
                  position: {
                    left: rect.left,
                    top: rect.bottom + 6,
                  },
                });
                setProjectMenuOpen(false);
              }}
            />
          ) : null}
          {folderMenu ? (
            <FolderActionsMenu
              position={folderMenu.position}
              onAddProjects={() => {
                addProject(folderMenu.folder);
                setFolderMenu(null);
              }}
              onCreateSubfolder={() => {
                setSelectedFolder(folderMenu.folder);
                setSubfolderModalOpen(true);
                setFolderMenu(null);
              }}
            />
          ) : null}
          {projectItems.slice(1).map((item) => (
            <WorkspaceNavButton collapsed={collapsed} item={item} key={item.label} />
          ))}
        </div>
        <p className="workspace-label px-2 pt-6 text-sm text-neutral-500">Recents</p>
        <div className="workspace-recents">
          {recents.length > 0 ? recents.map((recent) => (
            <span key={recent}>{recent}</span>
          )) : <span className="workspace-recents__empty">No recent projects</span>}
        </div>
      </div>
      <div className="workspace-sidebar__bottom">
        <div className="workspace-card workspace-card--referral">
          <div>
            <strong>Share Lovable</strong>
            <p>100 credits per paid referral</p>
          </div>
          <Gift className="h-5 w-5" />
        </div>
        <div className="workspace-card workspace-card--upgrade">
          <div>
            <strong>Upgrade to Pro</strong>
            <p>Unlock more features</p>
          </div>
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="workspace-account">
          <button
            className="workspace-avatar-button"
            type="button"
            aria-label="Open account menu"
            onClick={() => {
              setAccountMenuOpen((current) => !current);
              setWorkspaceMenuOpen(false);
            }}
          >
            R
          </button>
          <button className="workspace-inbox" type="button" aria-label="Inbox">
            <Inbox className="h-5 w-5 text-neutral-600" />
            <span />
          </button>
        </div>
      </div>
      {accountMenuOpen ? <AccountMenu collapsed={collapsed} themeMode={themeMode} onThemeChange={setThemeMode} /> : null}
      {folderModalOpen ? (
        <CreateFolderModal
          onClose={() => setFolderModalOpen(false)}
          onCreate={() => {
            setFolderModalOpen(false);
            router.push("/dashboard/projects");
          }}
        />
      ) : null}
      {subfolderModalOpen && selectedFolder ? (
        <CreateFolderModal
          title="Create subfolder"
          description={`Create a subfolder inside "${selectedFolder}"`}
          defaultName="demo"
          onClose={() => {
            setSubfolderModalOpen(false);
            setSelectedFolder(null);
          }}
          onCreate={(folderName) => {
            addSubfolder(selectedFolder, folderName || "demo");
            setSubfolderModalOpen(false);
            setSelectedFolder(null);
          }}
        />
      ) : null}
      {workspaceCreateOpen ? <CreateWorkspaceFlow onClose={() => setWorkspaceCreateOpen(false)} /> : null}
    </aside>
  );
}

function ProjectTree({
  activeFolder,
  items,
  onFolderAction,
}: {
  activeFolder?: string;
  items: ProjectTreeItem[];
  onFolderAction: (folder: string, rect: DOMRect) => void;
}) {
  const router = useRouter();

  return (
    <div className="workspace-project-tree">
      {items.map((item) => (
        <ProjectTreeNode activeFolder={activeFolder} item={item} key={item.folder} onFolderAction={onFolderAction} router={router} />
      ))}
    </div>
  );
}

function ProjectTreeNode({
  activeFolder,
  item,
  onFolderAction,
  router,
}: {
  activeFolder?: string;
  item: ProjectTreeItem;
  onFolderAction: (folder: string, rect: DOMRect) => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="workspace-project-tree__group">
      <button
        className={activeFolder === item.folder ? "active" : undefined}
        type="button"
        onClick={() => router.push(`/dashboard/projects/folders/${item.folder.toLowerCase().replace(/\s+/g, "-")}`)}
      >
        <Folder className="h-4 w-4" />
        <span>{item.folder}</span>
        <span
          className="workspace-project-tree__action"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onFolderAction(item.folder, event.currentTarget.getBoundingClientRect());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onFolderAction(item.folder, event.currentTarget.getBoundingClientRect());
            }
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </span>
      </button>
      {item.subfolders?.length ? (
        <div className="workspace-project-tree workspace-project-tree--nested">
          {item.subfolders.map((subfolder) => (
            <ProjectTreeNode activeFolder={activeFolder} item={subfolder} key={subfolder.folder} onFolderAction={onFolderAction} router={router} />
          ))}
        </div>
      ) : null}
      {item.projects.map((project) => (
        <button className="workspace-project-tree__project" type="button" key={project}>
          {project}
        </button>
      ))}
    </div>
  );
}

function FolderActionsMenu({
  position,
  onAddProjects,
  onCreateSubfolder,
}: {
  position: CSSProperties;
  onAddProjects: () => void;
  onCreateSubfolder: () => void;
}) {
  return (
    <div className="workspace-inline-menu workspace-folder-actions-menu" style={position}>
      <button type="button" onClick={onAddProjects}>
        <Plus className="h-4 w-4" />
        Add projects
      </button>
      <button type="button" onClick={onCreateSubfolder}>
        <FolderPlus className="h-4 w-4" />
        Create subfolder
      </button>
      <button type="button">
        <Folder className="h-4 w-4" />
        Edit folder
      </button>
      <button type="button">
        <FolderPlus className="h-4 w-4" />
        Move folder
      </button>
      <button className="danger" type="button">
        <Inbox className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}

function addSubfolderToTree(items: ProjectTreeItem[], parentFolder: string, subfolderName: string): ProjectTreeItem[] {
  return items.map((item) => {
    if (item.folder === parentFolder) {
      return {
        ...item,
        subfolders: [...(item.subfolders ?? []), { folder: subfolderName, projects: [] }],
      };
    }

    return {
      ...item,
      subfolders: item.subfolders ? addSubfolderToTree(item.subfolders, parentFolder, subfolderName) : item.subfolders,
    };
  });
}

function addProjectToTree(items: ProjectTreeItem[], folderName: string): ProjectTreeItem[] {
  return items.map((item) => {
    if (item.folder === folderName) {
      return {
        ...item,
        projects: [...item.projects, `test ${item.projects.length + 1}`],
      };
    }

    return {
      ...item,
      subfolders: item.subfolders ? addProjectToTree(item.subfolders, folderName) : item.subfolders,
    };
  });
}

function AllProjectsMenu({
  onCreateFolder,
  onCreateProject,
  position,
}: {
  onCreateFolder: () => void;
  onCreateProject: () => void;
  position?: CSSProperties;
}) {
  return (
    <div className="workspace-inline-menu workspace-inline-menu--floating" style={position}>
      <button type="button" onClick={onCreateProject}>
        <Plus className="h-4 w-4" />
        Create project
      </button>
      <button type="button" onClick={onCreateFolder}>
        <FolderPlus className="h-4 w-4" />
        Create folder
      </button>
    </div>
  );
}

function CreateFolderModal({
  onClose,
  onCreate,
  title = "Create folder",
  description = "Group related projects together",
  defaultName = "",
}: {
  onClose: () => void;
  onCreate: (folderName: string) => void;
  title?: string;
  description?: string;
  defaultName?: string;
}) {
  const [folderName, setFolderName] = useState(defaultName);

  return (
    <div className="workspace-modal-overlay">
      <section className="create-folder-modal" aria-label={title}>
        <button className="create-folder-modal__close" type="button" aria-label="Close create folder" onClick={onClose}>
          <X className="h-5 w-5" />
          ×
        </button>
        <h2>{title}</h2>
        <p>{description}</p>
        <label className="create-folder-modal__input">
          <Folder className="h-5 w-5" />
          <input placeholder="e.g. Side Projects" value={folderName} onChange={(event) => setFolderName(event.target.value)} />
        </label>
        <div className="create-folder-modal__visibility">
          <strong>Visibility</strong>
          <label className="selected">
            <input type="radio" defaultChecked name="folder-visibility" />
            <span>
              <b>Workspace</b>
              <small>All workspace members can see and add projects to this folder</small>
            </span>
          </label>
          <label>
            <input type="radio" name="folder-visibility" />
            <span>
              <b>Personal <em>Business</em></b>
              <small>Only you can see and add projects to this folder</small>
            </span>
          </label>
        </div>
        <div className="create-folder-modal__footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={() => onCreate(folderName.trim())}>
            Create
          </button>
        </div>
      </section>
    </div>
  );
}

function AccountMenu({
  collapsed,
  themeMode,
  onThemeChange,
}: {
  collapsed: boolean;
  themeMode: ThemeMode;
  onThemeChange: (themeMode: ThemeMode) => void;
}) {
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const menuItems = [
    { icon: CircleUserRound, label: "Profile" },
    { icon: Settings, label: "Settings", hint: "Ctrl ." },
    { icon: CircleHelp, label: "Support", trailing: true },
    { icon: BookOpen, label: "Documentation", trailing: true },
    { icon: Users, label: "Community" },
    { icon: House, label: "Home" },
  ];

  return (
    <div className={collapsed ? "workspace-popover workspace-popover--account workspace-popover--from-rail" : "workspace-popover workspace-popover--account"}>
      <div className="workspace-popover__profile">
        <span>R</span>
        <div>
          <strong>Rahul Mukati</strong>
          <p>27071996mukati@gmail.c...</p>
        </div>
      </div>
      <div className="workspace-popover__list">
        {menuItems.slice(0, 2).map((item) => (
          <button type="button" key={item.label} onMouseEnter={() => setAppearanceOpen(false)}>
            <item.icon className="h-4 w-4 text-neutral-600" />
            <span>{item.label}</span>
            {item.hint ? <small>{item.hint}</small> : null}
            {item.trailing ? <ChevronRight className="ml-auto h-4 w-4 text-neutral-500" /> : null}
          </button>
        ))}
        <button
          className={appearanceOpen ? "active" : undefined}
          type="button"
          onClick={() => setAppearanceOpen((current) => !current)}
          onMouseEnter={() => setAppearanceOpen(true)}
        >
          <SunMoon className="h-4 w-4 text-neutral-600" />
          <span>Appearance</span>
          <ChevronRight className="ml-auto h-4 w-4 text-neutral-500" />
        </button>
        {menuItems.slice(2).map((item) => (
          <button type="button" key={item.label} onMouseEnter={() => setAppearanceOpen(false)}>
            <item.icon className="h-4 w-4 text-neutral-600" />
            <span>{item.label}</span>
            {item.hint ? <small>{item.hint}</small> : null}
            {item.trailing ? <ChevronRight className="ml-auto h-4 w-4 text-neutral-500" /> : null}
          </button>
        ))}
      </div>
      <button className="workspace-popover__signout" type="button">
        <LogOut className="h-4 w-4 text-neutral-600" />
        <span>Sign out</span>
      </button>
      {appearanceOpen ? <AppearanceMenu themeMode={themeMode} onThemeChange={onThemeChange} /> : null}
    </div>
  );
}

function AppearanceMenu({ themeMode, onThemeChange }: { themeMode: ThemeMode; onThemeChange: (themeMode: ThemeMode) => void }) {
  const themes: ThemeMode[] = ["light", "dark", "system"];

  return (
    <div className="workspace-appearance-menu" onMouseEnter={() => undefined}>
      <section>
        <h3>Background</h3>
        <div className="workspace-appearance-menu__backgrounds">
          <button className="workspace-bg-swatch workspace-bg-swatch--waves" type="button" aria-label="Pink blue background" />
          <button className="workspace-bg-swatch workspace-bg-swatch--sunset" type="button" aria-label="Sunset background" />
          <button className="workspace-bg-swatch workspace-bg-swatch--soft" type="button" aria-label="Soft gradient background" />
        </div>
      </section>
      <section>
        <h3>Theme</h3>
        <div className="workspace-appearance-menu__themes">
          {themes.map((theme) => (
            <button type="button" key={theme} onClick={() => onThemeChange(theme)}>
              <span>{theme[0].toUpperCase() + theme.slice(1)}</span>
              {themeMode === theme ? <Check className="h-4 w-4" /> : null}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function WorkspaceSwitcherMenu({ collapsed, onCreateWorkspace }: { collapsed: boolean; onCreateWorkspace: () => void }) {
  return (
    <div className={collapsed ? "workspace-popover workspace-popover--switcher workspace-popover--from-rail" : "workspace-popover workspace-popover--switcher"}>
      <div className="workspace-popover__workspace-head">
        <span>R</span>
        <div>
          <strong>Rahul&apos;s Lovable</strong>
          <p>Free Plan - 1 member</p>
        </div>
      </div>
      <div className="workspace-popover__actions">
        <button type="button">
          <SlidersHorizontal className="h-4 w-4" />
          Settings
        </button>
        <button type="button">
          <UserPlus className="h-4 w-4" />
          Invite members
        </button>
      </div>
      <div className="workspace-upgrade-row">
        <span>
          <Zap className="h-4 w-4 fill-neutral-950" />
          Turn Pro
        </span>
        <button type="button">Upgrade</button>
      </div>
      <div className="workspace-credits-card">
        <div>
          <strong>Credits</strong>
          <span>5 left <ChevronRight className="h-4 w-4" /></span>
        </div>
        <div className="workspace-credits-card__bar">
          <span />
        </div>
        <p>Daily credits reset at midnight UTC</p>
      </div>
      <div className="workspace-list">
        <p>All workspaces</p>
        <button type="button">
          <span>R</span>
          Rahul&apos;s Lovable
          <small>FREE</small>
          <ChevronDown className="ml-auto h-4 w-4 rotate-[-90deg]" />
        </button>
        <button type="button">
          <span>S</span>
          Shailja&apos;s Lovable
          <small>FREE</small>
        </button>
      </div>
      <button className="workspace-create-row" type="button" onClick={onCreateWorkspace}>
        <span>
          <Plus className="h-4 w-4" />
        </span>
        Create new workspace
      </button>
    </div>
  );
}

function CreateWorkspaceFlow({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "plan">("details");
  const [workspaceName, setWorkspaceName] = useState("SLMobbin Design");
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "business">("pro");

  const finishCreateWorkspace = () => {
    onClose();
    router.push("/dashboard");
  };

  return (
    <div className="workspace-create-flow">
      <button className="workspace-create-flow__close" type="button" aria-label="Close create workspace" onClick={onClose}>
        <X className="h-5 w-5" />
      </button>
      {step === "details" ? (
        <section className="workspace-create-flow__panel workspace-create-flow__panel--details">
          <LovableLogo />
          <h1>Create a Workspace</h1>
          <p>Create a new place to make projects or collaborate with others.</p>
          <label>
            <span>Workspace name</span>
            <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
          </label>
          <div className="workspace-create-flow__actions">
            <button type="button" onClick={onClose}>
              Go Back
            </button>
            <button type="button" onClick={() => setStep("plan")}>
              Continue to Plan
            </button>
          </div>
        </section>
      ) : (
        <section className="workspace-create-flow__panel workspace-create-flow__panel--plans">
          <LovableLogo />
          <h1>Select a Plan</h1>
          <p>Select a plan for your new workspace.</p>
          <div className="workspace-plan-grid">
            <WorkspacePlanCard
              active={selectedPlan === "pro"}
              credits="200 credits / month"
              features={[
                "200 monthly credits",
                "5 daily credits (up to 150/month)",
                "Usage-based Cloud + AI",
                "Credit rollovers",
                "Unlimited lovable.app domains",
                "Custom domains",
                "Remove the Lovable badge",
              ]}
              name="Pro"
              onSelect={() => setSelectedPlan("pro")}
              subtitle="Designed for fast-moving teams building together in real time."
            />
            <WorkspacePlanCard
              active={selectedPlan === "business"}
              credits="100 credits / month"
              features={["100 monthly credits", "Internal publish", "SSO", "Personal Projects", "Opt out of data training", "Design templates"]}
              name="Business"
              onSelect={() => setSelectedPlan("business")}
              subtitle="Advanced controls and power features for growing departments"
            />
          </div>
          <div className="workspace-create-flow__actions workspace-create-flow__actions--plans">
            <button type="button" onClick={() => setStep("details")}>
              Go Back
            </button>
            <button type="button" onClick={finishCreateWorkspace}>
              Create Workspace
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function WorkspacePlanCard({
  active,
  credits,
  features,
  name,
  onSelect,
  subtitle,
}: {
  active: boolean;
  credits: string;
  features: string[];
  name: string;
  onSelect: () => void;
  subtitle: string;
}) {
  return (
    <article className={active ? "workspace-plan-card active" : "workspace-plan-card"}>
      <div className="workspace-plan-card__intro">
        <h2>{name}</h2>
        <p>{subtitle}</p>
        <strong>
          $50 <span>per month</span>
        </strong>
        <p>shared across unlimited users</p>
      </div>
      <div className="workspace-plan-card__billing">
        <button type="button" aria-label={`${name} annual billing toggle`} />
        <span>Annual</span>
      </div>
      <div className="workspace-plan-card__body">
        <button className="workspace-plan-card__select" type="button" onClick={onSelect}>
          Select
        </button>
        <button className="workspace-plan-card__credits" type="button">
          {credits}
          <ChevronDown className="h-4 w-4" />
        </button>
        <p>All features in {name === "Pro" ? "Free" : "Pro"}, plus:</p>
        <ul>
          {features.map((feature) => (
            <li key={feature}>
              <Check className="h-4 w-4" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
