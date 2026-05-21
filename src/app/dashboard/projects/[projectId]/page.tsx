import { ProjectDetailRouteScreen } from "@/components/workspace/projects-route-screen";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ folderId?: string }>;
}) {
  const { projectId } = await params;
  const { folderId } = await searchParams;

  return <ProjectDetailRouteScreen folderId={folderId} projectId={projectId} />;
}
