
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useTaskContext } from "@/contexts/TaskContext";

export const TaskProgress = () => {
  const { tasks } = useTaskContext();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Task Completion</h3>
        <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} tasks</span>
      </div>
      <Progress value={progressPercentage} className="mt-3 h-2" />
      <div className="mt-1 text-right text-sm text-muted-foreground">
        {progressPercentage}% complete
      </div>
    </div>
  );
};
