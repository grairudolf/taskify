
import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Task, Priority } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Tasks = () => {
  const { tasks, projects, getFilteredTasks } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<Priority | "">("");
  const [filterProject, setFilterProject] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  // Filter tasks based on search, status, priority, and project
  const filteredTasks = tasks.filter(task => {
    // Search term filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter (tab)
    if (activeTab === "completed" && !task.completed) return false;
    if (activeTab === "pending" && task.completed) return false;
    
    // Priority filter
    if (filterPriority && task.priority !== filterPriority) return false;
    
    // Project filter
    if (filterProject && task.projectId !== filterProject) return false;
    
    return true;
  });

  const filterCount = (filterPriority ? 1 : 0) + (filterProject ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button className="mt-2 sm:mt-0" onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex min-w-[120px] items-center justify-between">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter</span>
                {filterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                    {filterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Tasks</h4>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={filterPriority} onValueChange={value => setFilterPriority(value as Priority | "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={filterProject} onValueChange={setFilterProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFilterPriority("");
                      setFilterProject("");
                    }}
                  >
                    Reset filters
                  </Button>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <TaskList tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <TaskList tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <TaskList tasks={filteredTasks} onEdit={handleEditTask} />
        </TabsContent>
      </Tabs>

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

const TaskList: React.FC<{ tasks: Task[], onEdit: (task: Task) => void }> = ({ tasks, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default Tasks;
