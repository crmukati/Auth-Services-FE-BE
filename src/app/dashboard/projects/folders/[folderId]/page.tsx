import { FolderRouteScreen } from "@/components/workspace/projects-route-screen";

const folderNames: Record<string, string> = {
  setup: "setup",
  demo: "demo",
  testing: "testing",
  "new-folder": "New folder",
};

type FolderPageProps = {
  params: Promise<{
    folderId: string;
  }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;

  return <FolderRouteScreen folderId={folderId} folderName={folderNames[folderId] ?? "setup"} />;
}
