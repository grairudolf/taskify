import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskProgress } from "@/components/dashboard/TaskProgress";
import { TaskChart } from "@/components/dashboard/TaskChart";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { ListTodo, CheckCheck, Clock, AlertTriangle, Plus } from "lucide-react";
import { Task } from "@/types/task";

const Dashboard = () => {
  const { tasks, getTaskStats, getFilteredTasks } = useTaskContext();
  const stats = getTaskStats();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  
  // Get recent tasks (incomplete tasks first, then sorted by due date)
  const recentTasks = [...tasks]
    .filter(task => !task.completed)
    .sort((a, b) => {
      // Sort by due date if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Tasks with due dates come before those without
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Otherwise sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5); // Get only 5 most recent or urgent tasks
  
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button className="mt-2 sm:mt-0" onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={<ListTodo size={20} />}
          className="border-l-4 border-l-blue-500"
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<CheckCheck size={20} />}
          className="border-l-4 border-l-green-500"
        />
        <StatCard 
          title="In Progress" 
          value={stats.pending} 
          icon={<Clock size={20} />}
          className="border-l-4 border-l-yellow-500"
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={<AlertTriangle size={20} />}
          className="border-l-4 border-l-red-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskChart />
        </div>
        <div className="space-y-6">
          <TaskProgress />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <Button variant="ghost" size="sm" asChild>
            <a href="/tasks">View all</a>
          </Button>
        </div>
        <div className="space-y-3">
          {recentTasks.length > 0 ? (
            recentTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
              />
            ))
          ) : (
            <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <p className="text-muted-foreground">No tasks yet</p>
              <Button 
                variant="link" 
                className="mt-2" 
                onClick={() => setShowTaskForm(true)}
              >
                Create your first task
              </Button>
            </div>
          )}
        </div>
      </div>

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

export default Dashboard;
