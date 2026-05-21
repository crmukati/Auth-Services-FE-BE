# All Projects CRUD API Artifact

## Goal

Static data in the workspace sidebar, projects page, folder detail page, project cards, and project screens must become dynamic using APIs.

Current static areas:

- `src/components/workspace/workspace-sidebar.tsx`
  - `initialProjectTree`
  - sidebar folder tree
  - folder three-dot CRUD menu
- `src/components/workspace/projects-route-screen.tsx`
  - project folders list
  - folder detail actions
  - project detail route
- `src/components/workspace/workspace-projects.tsx`
  - dashboard project cards
  - project card three-dot menu
  - project screens panel

## Core Entities

### Workspace

```ts
type Workspace = {
  id: string;
  name: string;
  plan: "free" | "pro" | "business";
  memberCount: number;
  currentUserRole: "owner" | "admin" | "member";
};
```

### Folder

```ts
type ProjectFolder = {
  id: string;
  workspaceId: string;
  parentFolderId: string | null;
  name: string;
  visibility: "workspace" | "personal";
  projectCount: number;
  children?: ProjectFolder[];
  projects?: ProjectListItem[];
  createdAt: string;
  updatedAt: string;
};
```

### Project

```ts
type ProjectListItem = {
  id: string;
  workspaceId: string;
  folderId: string | null;
  name: string;
  description?: string;
  status: "active" | "archived" | "deleted";
  visibility: "workspace" | "personal";
  creatorId: string;
  creatorName: string;
  thumbnailUrl?: string;
  lastEditedAt: string;
  createdAt: string;
  updatedAt: string;
};
```

### Project Screen

```ts
type ProjectScreen = {
  id: string;
  projectId: string;
  name: string;
  routePath: string;
  order: number;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
};
```

## API List

### 1. Get Current Workspace

Use in:

- Sidebar workspace switcher
- Dashboard initial load
- All project APIs as `workspaceId`

Endpoint:

```http
GET /api/workspaces/current
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "ws_001",
    "name": "Rahul's Lovable",
    "plan": "free",
    "memberCount": 1,
    "currentUserRole": "owner"
  }
}
```

### 2. Get Workspace Folder Tree

Use in:

- Sidebar `All projects` accordion
- Replace `initialProjectTree`
- Show nested folder and project names dynamically

Endpoint:

```http
GET /api/workspaces/{workspaceId}/folders/tree
```

Query params:

```ts
{
  includeProjects?: boolean; // true for sidebar tree
}
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "fold_001",
      "workspaceId": "ws_001",
      "parentFolderId": null,
      "name": "setup",
      "visibility": "workspace",
      "projectCount": 0,
      "children": [
        {
          "id": "fold_002",
          "workspaceId": "ws_001",
          "parentFolderId": "fold_001",
          "name": "demo",
          "visibility": "workspace",
          "projectCount": 0,
          "children": [],
          "projects": []
        }
      ],
      "projects": []
    }
  ]
}
```

### 3. Get Project Folders

Use in:

- `/dashboard/projects`
- Folder grid/list in main Projects screen

Endpoint:

```http
GET /api/workspaces/{workspaceId}/folders
```

Query params:

```ts
{
  parentFolderId?: string | null;
  search?: string;
  visibility?: "workspace" | "personal" | "any";
}
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "fold_001",
      "workspaceId": "ws_001",
      "parentFolderId": null,
      "name": "setup",
      "visibility": "workspace",
      "projectCount": 0,
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z"
    }
  ]
}
```

### 4. Create Folder

Use in:

- `All projects` three-dot menu -> `Create folder`
- Creates root-level folder

Endpoint:

```http
POST /api/workspaces/{workspaceId}/folders
```

Payload:

```json
{
  "name": "Side Projects",
  "parentFolderId": null,
  "visibility": "workspace"
}
```

Response:

```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": "fold_003",
    "workspaceId": "ws_001",
    "parentFolderId": null,
    "name": "Side Projects",
    "visibility": "workspace",
    "projectCount": 0,
    "createdAt": "2026-05-20T10:05:00.000Z",
    "updatedAt": "2026-05-20T10:05:00.000Z"
  }
}
```

### 5. Create Subfolder

Use in:

- Folder three-dot menu -> `Create subfolder`
- Folder detail empty screen -> `Create subfolder`

Endpoint:

```http
POST /api/workspaces/{workspaceId}/folders/{folderId}/subfolders
```

Payload:

```json
{
  "name": "demo"
}
```

Backend note:

- Subfolder should inherit `visibility` from parent folder.

Response:

```json
{
  "success": true,
  "message": "Subfolder created successfully",
  "data": {
    "id": "fold_004",
    "workspaceId": "ws_001",
    "parentFolderId": "fold_001",
    "name": "demo",
    "visibility": "workspace",
    "projectCount": 0,
    "createdAt": "2026-05-20T10:10:00.000Z",
    "updatedAt": "2026-05-20T10:10:00.000Z"
  }
}
```

### 6. Update Folder

Use in:

- Folder three-dot menu -> `Edit folder`

Endpoint:

```http
PATCH /api/workspaces/{workspaceId}/folders/{folderId}
```

Payload:

```json
{
  "name": "Updated setup",
  "visibility": "workspace"
}
```

Response:

```json
{
  "success": true,
  "message": "Folder updated successfully",
  "data": {
    "id": "fold_001",
    "workspaceId": "ws_001",
    "parentFolderId": null,
    "name": "Updated setup",
    "visibility": "workspace",
    "projectCount": 2,
    "updatedAt": "2026-05-20T10:15:00.000Z"
  }
}
```

### 7. Move Folder

Use in:

- Folder three-dot menu -> `Move folder`

Endpoint:

```http
PATCH /api/workspaces/{workspaceId}/folders/{folderId}/move
```

Payload:

```json
{
  "targetParentFolderId": "fold_003"
}
```

For moving to root:

```json
{
  "targetParentFolderId": null
}
```

Response:

```json
{
  "success": true,
  "message": "Folder moved successfully",
  "data": {
    "id": "fold_001",
    "parentFolderId": "fold_003"
  }
}
```

### 8. Delete Folder

Use in:

- Folder three-dot menu -> `Delete`

Endpoint:

```http
DELETE /api/workspaces/{workspaceId}/folders/{folderId}
```

Query params:

```ts
{
  deleteProjects?: boolean; // false means move projects to root or block delete
}
```

Recommended payload if using body:

```json
{
  "deleteProjects": false
}
```

Response:

```json
{
  "success": true,
  "message": "Folder deleted successfully",
  "data": {
    "deletedFolderId": "fold_001"
  }
}
```

### 9. Get Projects

Use in:

- `/dashboard/projects`
- Dashboard project cards
- Search projects
- Recently viewed tab
- Shared with me tab
- Folder detail page

Endpoint:

```http
GET /api/workspaces/{workspaceId}/projects
```

Query params:

```ts
{
  folderId?: string | null;
  search?: string;
  sort?: "lastEdited" | "createdAt" | "name";
  visibility?: "workspace" | "personal" | "any";
  status?: "active" | "archived" | "any";
  creatorId?: string | "all";
  tab?: "my-projects" | "recently-viewed" | "shared-with-me" | "templates";
  page?: number;
  limit?: number;
}
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "proj_001",
        "workspaceId": "ws_001",
        "folderId": "fold_001",
        "name": "Your Online Shop",
        "description": "Ecommerce landing flow",
        "status": "active",
        "visibility": "workspace",
        "creatorId": "user_001",
        "creatorName": "Rahul Mukati",
        "thumbnailUrl": "/images/project-thumb-1.png",
        "lastEditedAt": "2026-05-15T10:00:00.000Z",
        "createdAt": "2026-05-01T10:00:00.000Z",
        "updatedAt": "2026-05-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 10. Create Project

Use in:

- `All projects` three-dot menu -> `Create project`
- Folder detail empty state -> `New project`
- Dashboard prompt submit can also create a project

Endpoint:

```http
POST /api/workspaces/{workspaceId}/projects
```

Payload:

```json
{
  "name": "New Project",
  "prompt": "Create an online shop landing page",
  "folderId": "fold_001",
  "visibility": "workspace"
}
```

Response:

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "proj_002",
    "workspaceId": "ws_001",
    "folderId": "fold_001",
    "name": "New Project",
    "status": "active",
    "visibility": "workspace",
    "creatorId": "user_001",
    "creatorName": "Rahul Mukati",
    "thumbnailUrl": null,
    "lastEditedAt": "2026-05-20T10:25:00.000Z",
    "createdAt": "2026-05-20T10:25:00.000Z",
    "updatedAt": "2026-05-20T10:25:00.000Z"
  }
}
```

Frontend redirect after success:

```ts
router.push(`/dashboard/projects/${data.id}`);
```

### 11. Get Project Detail

Use in:

- `/dashboard/projects/[projectId]`
- Project detail screen
- Screens panel header

Endpoint:

```http
GET /api/workspaces/{workspaceId}/projects/{projectId}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "workspaceId": "ws_001",
    "folderId": "fold_001",
    "name": "Your Online Shop",
    "description": "Ecommerce landing flow",
    "status": "active",
    "visibility": "workspace",
    "creatorId": "user_001",
    "creatorName": "Rahul Mukati",
    "thumbnailUrl": "/images/project-thumb-1.png",
    "lastEditedAt": "2026-05-15T10:00:00.000Z",
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-15T10:00:00.000Z"
  }
}
```

### 12. Update Project

Use in:

- Project card three-dot menu -> rename/edit project
- Project detail settings

Endpoint:

```http
PATCH /api/workspaces/{workspaceId}/projects/{projectId}
```

Payload:

```json
{
  "name": "Updated Online Shop",
  "description": "Updated description",
  "visibility": "workspace",
  "status": "active"
}
```

Response:

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "proj_001",
    "name": "Updated Online Shop",
    "description": "Updated description",
    "visibility": "workspace",
    "status": "active",
    "updatedAt": "2026-05-20T10:30:00.000Z"
  }
}
```

### 13. Move Project To Folder

Use in:

- Folder detail -> `Add existing`
- Folder action -> `Add projects`
- Project card menu -> move project

Endpoint:

```http
PATCH /api/workspaces/{workspaceId}/projects/{projectId}/move
```

Payload:

```json
{
  "folderId": "fold_001"
}
```

For moving out of folder:

```json
{
  "folderId": null
}
```

Response:

```json
{
  "success": true,
  "message": "Project moved successfully",
  "data": {
    "id": "proj_001",
    "folderId": "fold_001"
  }
}
```

### 14. Add Multiple Existing Projects To Folder

Use in:

- Folder detail -> `Add existing` modal

Endpoint:

```http
POST /api/workspaces/{workspaceId}/folders/{folderId}/projects
```

Payload:

```json
{
  "projectIds": ["proj_001", "proj_002"]
}
```

Response:

```json
{
  "success": true,
  "message": "Projects added to folder",
  "data": {
    "folderId": "fold_001",
    "projectIds": ["proj_001", "proj_002"]
  }
}
```

### 15. Delete Project

Use in:

- Project card three-dot menu -> delete
- Project detail actions

Endpoint:

```http
DELETE /api/workspaces/{workspaceId}/projects/{projectId}
```

Payload:

```json
{
  "softDelete": true
}
```

Response:

```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {
    "deletedProjectId": "proj_001"
  }
}
```

### 16. Duplicate Project

Use in:

- Project card three-dot menu -> duplicate

Endpoint:

```http
POST /api/workspaces/{workspaceId}/projects/{projectId}/duplicate
```

Payload:

```json
{
  "name": "Your Online Shop Copy",
  "folderId": "fold_001"
}
```

Response:

```json
{
  "success": true,
  "message": "Project duplicated successfully",
  "data": {
    "id": "proj_003",
    "name": "Your Online Shop Copy",
    "folderId": "fold_001"
  }
}
```

### 17. Get Project Screens

Use in:

- Project card three-dot menu -> `View screens`
- Screens panel
- Project detail center/inner pages

Endpoint:

```http
GET /api/workspaces/{workspaceId}/projects/{projectId}/screens
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "screen_001",
      "projectId": "proj_001",
      "name": "Home",
      "routePath": "/",
      "order": 1,
      "thumbnailUrl": "/images/screens/home.png",
      "createdAt": "2026-05-20T10:35:00.000Z",
      "updatedAt": "2026-05-20T10:35:00.000Z"
    }
  ]
}
```

### 18. Create Project Screen

Use in:

- Screens panel -> `Create screen`

Endpoint:

```http
POST /api/workspaces/{workspaceId}/projects/{projectId}/screens
```

Payload:

```json
{
  "name": "Product Details",
  "routePath": "/products/[id]",
  "order": 2
}
```

Response:

```json
{
  "success": true,
  "message": "Screen created successfully",
  "data": {
    "id": "screen_002",
    "projectId": "proj_001",
    "name": "Product Details",
    "routePath": "/products/[id]",
    "order": 2,
    "thumbnailUrl": null,
    "createdAt": "2026-05-20T10:40:00.000Z",
    "updatedAt": "2026-05-20T10:40:00.000Z"
  }
}
```

### 19. Update Project Screen

Use in:

- Screens panel -> rename/reorder screen

Endpoint:

```http
PATCH /api/workspaces/{workspaceId}/projects/{projectId}/screens/{screenId}
```

Payload:

```json
{
  "name": "Product Detail",
  "routePath": "/products/[id]",
  "order": 2
}
```

Response:

```json
{
  "success": true,
  "message": "Screen updated successfully",
  "data": {
    "id": "screen_002",
    "name": "Product Detail",
    "routePath": "/products/[id]",
    "order": 2
  }
}
```

### 20. Delete Project Screen

Use in:

- Screens panel -> delete screen

Endpoint:

```http
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/screens/{screenId}
```

Response:

```json
{
  "success": true,
  "message": "Screen deleted successfully",
  "data": {
    "deletedScreenId": "screen_002"
  }
}
```

### 21. Get Recently Viewed Projects

Use in:

- Sidebar `Recents`
- Dashboard `Recently viewed` tab

Endpoint:

```http
GET /api/workspaces/{workspaceId}/projects/recent
```

Query params:

```ts
{
  limit?: number;
}
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "proj_001",
      "name": "Your Online Shop",
      "lastViewedAt": "2026-05-20T10:45:00.000Z"
    }
  ]
}
```

### 22. Track Project View

Use in:

- When user opens `/dashboard/projects/[projectId]`

Endpoint:

```http
POST /api/workspaces/{workspaceId}/projects/{projectId}/view
```

Payload:

```json
{
  "source": "sidebar"
}
```

Response:

```json
{
  "success": true,
  "message": "Project view tracked"
}
```

## UI To API Mapping

### Sidebar Load

Component:

- `src/components/workspace/workspace-sidebar.tsx`

APIs:

- `GET /api/workspaces/current`
- `GET /api/workspaces/{workspaceId}/folders/tree?includeProjects=true`
- `GET /api/workspaces/{workspaceId}/projects/recent?limit=6`

Replace:

- `initialProjectTree`
- `recents`

### All Projects Three-Dot Menu

Component:

- `WorkspaceSidebar`
- `AllProjectsMenu`

Actions:

- `Create project`
  - `POST /api/workspaces/{workspaceId}/projects`
  - Redirect to `/dashboard/projects/{projectId}`
- `Create folder`
  - `POST /api/workspaces/{workspaceId}/folders`
  - Refresh folder tree

### Folder Three-Dot Menu

Component:

- `FolderActionsMenu`

Actions:

- `Add projects`
  - Open add existing modal
  - `POST /api/workspaces/{workspaceId}/folders/{folderId}/projects`
- `Create subfolder`
  - `POST /api/workspaces/{workspaceId}/folders/{folderId}/subfolders`
  - Refresh folder tree
- `Edit folder`
  - `PATCH /api/workspaces/{workspaceId}/folders/{folderId}`
- `Move folder`
  - `PATCH /api/workspaces/{workspaceId}/folders/{folderId}/move`
- `Delete`
  - `DELETE /api/workspaces/{workspaceId}/folders/{folderId}`

### Projects Page

Route:

- `/dashboard/projects`

Component:

- `ProjectsRouteScreen`

APIs:

- `GET /api/workspaces/{workspaceId}/folders`
- `GET /api/workspaces/{workspaceId}/projects`

Filters:

- search
- sort
- visibility
- status
- creator
- grid/list view is frontend-only

### Folder Detail Page

Route:

- `/dashboard/projects/folders/{folderId}`

Component:

- `FolderRouteScreen`

APIs:

- `GET /api/workspaces/{workspaceId}/folders/{folderId}`
- `GET /api/workspaces/{workspaceId}/folders?parentFolderId={folderId}`
- `GET /api/workspaces/{workspaceId}/projects?folderId={folderId}`

Actions:

- `New project`
  - `POST /api/workspaces/{workspaceId}/projects`
- `Add existing`
  - `GET /api/workspaces/{workspaceId}/projects?folderId=null`
  - `POST /api/workspaces/{workspaceId}/folders/{folderId}/projects`
- `Create subfolder`
  - `POST /api/workspaces/{workspaceId}/folders/{folderId}/subfolders`

### Dashboard Project Cards

Component:

- `WorkspaceProjects`

APIs:

- `GET /api/workspaces/{workspaceId}/projects?tab=my-projects&limit=3`
- `GET /api/workspaces/{workspaceId}/projects?tab=recently-viewed&limit=3`
- `GET /api/workspaces/{workspaceId}/projects?tab=shared-with-me&limit=3`

Project card menu:

- View screens: `GET /api/workspaces/{workspaceId}/projects/{projectId}/screens`
- Rename/edit: `PATCH /api/workspaces/{workspaceId}/projects/{projectId}`
- Duplicate: `POST /api/workspaces/{workspaceId}/projects/{projectId}/duplicate`
- Delete: `DELETE /api/workspaces/{workspaceId}/projects/{projectId}`

## Recommended Frontend Data Layer

Use a small API client folder:

```txt
src/services/
  api-client.ts
  workspace-api.ts
  folders-api.ts
  projects-api.ts
  screens-api.ts
```

Recommended hooks:

```txt
src/hooks/projects/
  use-workspace.ts
  use-folder-tree.ts
  use-projects.ts
  use-project-screens.ts
```

Recommended Zustand store:

```txt
src/store/workspace-store.ts
```

Store only shared UI/server state:

```ts
type WorkspaceStore = {
  workspace: Workspace | null;
  folderTree: ProjectFolder[];
  recents: ProjectListItem[];
  setWorkspace: (workspace: Workspace) => void;
  setFolderTree: (folders: ProjectFolder[]) => void;
  setRecents: (projects: ProjectListItem[]) => void;
};
```

Keep modal open/close state local inside components.

## API Error Format

Use same shape for every API:

```json
{
  "success": false,
  "message": "Folder name is required",
  "errors": {
    "name": "Folder name is required"
  }
}
```

Common status codes:

- `200` success
- `201` created
- `400` validation error
- `401` unauthenticated
- `403` permission denied
- `404` not found
- `409` duplicate name or invalid move
- `500` server error

## Important Validation Rules

Folder:

- `name` required
- max length `80`
- duplicate folder names blocked under same parent
- parent folder must belong to same workspace
- cannot move folder inside itself or its child

Project:

- `name` required
- max length `120`
- folder must belong to same workspace
- visibility must match permission rules

Screen:

- `name` required
- route path should start with `/`
- screen order must be numeric

## Migration Plan From Static To API

1. Add API client files.
2. Fetch current workspace on dashboard mount.
3. Replace sidebar `initialProjectTree` with `GET /folders/tree`.
4. Replace sidebar recents with `GET /projects/recent`.
5. Replace `/dashboard/projects` static folder list with `GET /folders`.
6. Replace folder route mapping with real folder id from URL.
7. Replace `New project` local redirect with `POST /projects`.
8. Replace `Create folder` modal submit with `POST /folders`.
9. Replace `Create subfolder` modal submit with `POST /folders/{folderId}/subfolders`.
10. Replace `Add existing` modal with project search and `POST /folders/{folderId}/projects`.
11. Replace dashboard project cards with `GET /projects?tab=...`.
12. Replace project screens panel with `GET /projects/{projectId}/screens`.

## Minimal Backend Table Structure

```txt
workspaces
  id
  name
  plan
  created_at
  updated_at

workspace_members
  id
  workspace_id
  user_id
  role

project_folders
  id
  workspace_id
  parent_folder_id
  name
  visibility
  created_by
  created_at
  updated_at

projects
  id
  workspace_id
  folder_id
  name
  description
  status
  visibility
  creator_id
  thumbnail_url
  last_edited_at
  created_at
  updated_at

project_screens
  id
  project_id
  name
  route_path
  order
  thumbnail_url
  created_at
  updated_at

project_views
  id
  workspace_id
  project_id
  user_id
  source
  viewed_at
```

## Priority APIs To Build First

1. `GET /api/workspaces/current`
2. `GET /api/workspaces/{workspaceId}/folders/tree?includeProjects=true`
3. `POST /api/workspaces/{workspaceId}/folders`
4. `POST /api/workspaces/{workspaceId}/folders/{folderId}/subfolders`
5. `GET /api/workspaces/{workspaceId}/projects`
6. `POST /api/workspaces/{workspaceId}/projects`
7. `POST /api/workspaces/{workspaceId}/folders/{folderId}/projects`
8. `GET /api/workspaces/{workspaceId}/projects/{projectId}/screens`
