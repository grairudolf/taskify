
import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Folders } from "lucide-react";
import { Task } from "@/types/task";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";

const Projects = () => {
  const { projects, addProject, getTasksByProject } = useTaskContext();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState("#8B5CF6");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(
    projects.length > 0 ? projects[0].id : undefined
  );

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const handleAddProject = () => {
    if (projectName.trim()) {
      addProject(projectName.trim(), projectColor);
      setProjectName("");
      setProjectColor("#8B5CF6");
      setShowProjectForm(false);
    }
  };

  const activeProject = projects.find(project => project.id === activeProjectId);
  const projectTasks = getTasksByProject(activeProjectId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="mt-2 flex space-x-2 sm:mt-0">
          <Button variant="outline" onClick={() => setShowProjectForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {projects.length > 0 ? (
        <>
          <Tabs 
            value={activeProjectId} 
            onValueChange={setActiveProjectId}
            className="space-y-4"
          >
            <div className="overflow-x-auto">
              <TabsList className="inline-flex h-10 w-auto">
                {projects.map(project => (
                  <TabsTrigger
                    key={project.id}
                    value={project.id}
                    className="relative px-6"
                    style={{ 
                      "--tab-highlight": project.color 
                    } as React.CSSProperties}
                  >
                    <span 
                      className="mr-2 h-3 w-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {projects.map(project => (
              <TabsContent key={project.id} value={project.id} className="space-y-4">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-6 w-6 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="text-lg font-medium">{project.name}</h3>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {getTasksByProject(project.id).length} tasks in this project
                  </p>
                </div>

                <div className="space-y-3">
                  {getTasksByProject(project.id).length > 0 ? (
                    getTasksByProject(project.id).map(task => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                      <p className="text-muted-foreground">No tasks in this project yet</p>
                      <Button 
                        variant="link" 
                        className="mt-2" 
                        onClick={() => setShowTaskForm(true)}
                      >
                        Add your first task to {project.name}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <Folders className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No projects yet</p>
          <Button 
            variant="link" 
            className="mt-2" 
            onClick={() => setShowProjectForm(true)}
          >
            Create your first project
          </Button>
        </div>
      )}

      {/* Project Form Dialog */}
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Project Color</Label>
              <HexColorPicker color={projectColor} onChange={setProjectColor} />
              <div className="mt-2 flex items-center space-x-2">
                <div 
                  className="h-6 w-6 rounded-full" 
                  style={{ backgroundColor: projectColor }}
                />
                <Input 
                  value={projectColor} 
                  onChange={(e) => setProjectColor(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Form */}
      <TaskForm
        task={editTask}
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditTask(undefined);
        }}
      />
    </div>
  );
};

export default Projects;
