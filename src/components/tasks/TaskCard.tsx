
import React from "react";
import { Task, Priority } from "@/types/task";
import { format } from "date-fns";
import { useTaskContext } from "@/contexts/TaskContext";
import { Trash2, Edit, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityClasses: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask, getProjectById } = useTaskContext();
  const project = getProjectById(task.projectId);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={cn(
      "group relative flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-all",
      task.completed && "border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-900/10",
      isOverdue && !task.completed && "border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-900/10"
    )}>
      <div className="absolute right-2 top-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="rounded-full p-1 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex pt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            className={cn(
              "h-5 w-5 transition-all",
              task.completed && "animate-check-mark bg-green-500 text-primary-foreground"
            )}
          />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "text-base font-medium",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "mt-1 text-sm text-muted-foreground",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {task.dueDate && (
          <div className={cn(
            "flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs",
            isOverdue && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          )}>
            <Clock size={12} />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}

        <div className={cn("rounded-full px-2 py-0.5 text-xs", priorityClasses[task.priority])}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>

        {project && (
          <div
            className="rounded-full px-2 py-0.5 text-xs text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.name}
          </div>
        )}

        {task.tags.length > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs">
            <Tag size={12} />
            <span>{task.tags.length > 1 ? `${task.tags.length} tags` : task.tags[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};
