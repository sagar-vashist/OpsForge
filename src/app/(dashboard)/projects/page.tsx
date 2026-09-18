import { getProjects, deleteProject } from '@/app/actions/projects'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function ProjectsPage({ searchParams }: { searchParams: { q?: string } }) {
  // Catch missing env variables so page doesn't crash during build
  let projects: any[] = []
  try {
    projects = await getProjects(searchParams.q)
  } catch (e) {
    console.warn("Could not fetch projects, likely missing Supabase credentials")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
          <Link href="/projects/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </div>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-[#0f172a]">
            <TableRow className="hover:bg-[#0f172a]">
              <TableHead className="text-white font-bold">Project Name</TableHead>
              <TableHead className="text-white font-bold">Code</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold">Priority</TableHead>
              <TableHead className="text-white font-bold">Progress</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No projects found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.project_code}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'COMPLETED' ? 'completed' : project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.priority ? project.priority.toLowerCase() as any : 'outline'}>
                      {project.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.progress}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/projects/${project.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                      {project.status === 'COMPLETED' && (
                        <form action={async () => {
                          'use server'
                          await deleteProject(project.id)
                        }}>
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Delete completed project">
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
