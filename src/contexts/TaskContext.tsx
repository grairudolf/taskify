
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task, Project, TaskStats, Priority } from '../types/task';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface TaskContextProps {
  tasks: Task[];
  projects: Project[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addProject: (name: string, color: string) => void;
  getTasksByProject: (projectId: string | undefined) => Task[];
  getTasksByTag: (tag: string) => Task[];
  getFilteredTasks: (completed?: boolean, priority?: Priority, projectId?: string) => Task[];
  getTaskStats: () => TaskStats;
  getProjectById: (id: string | undefined) => Project | undefined;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [
      { id: 'default', name: 'Personal', color: '#8B5CF6' },
      { id: 'work', name: 'Work', color: '#0EA5E9' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully");
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));

    const task = tasks.find(t => t.id === id);
    if (task) {
      if (!task.completed) {
        toast.success("Task completed! 🎉");
      }
    }
  };

  const addProject = (name: string, color: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      color
    };
    setProjects([...projects, newProject]);
    toast.success("Project created successfully");
  };

  const getTasksByProject = (projectId: string | undefined) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByTag = (tag: string) => {
    return tasks.filter(task => task.tags.includes(tag));
  };

  const getFilteredTasks = (completed?: boolean, priority?: Priority, projectId?: string) => {
    return tasks.filter(task => {
      // Filter by completion status if provided
      if (completed !== undefined && task.completed !== completed) {
        return false;
      }
      
      // Filter by priority if provided
      if (priority && task.priority !== priority) {
        return false;
      }
      
      // Filter by project if provided
      if (projectId && task.projectId !== projectId) {
        return false;
      }
      
      return true;
    });
  };

  const getTaskStats = (): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    // Count overdue tasks (due date is in the past and task is not completed)
    const now = new Date();
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length;
    
    return {
      total,
      completed,
      pending,
      overdue
    };
  };

  const getProjectById = (id: string | undefined): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addProject,
        getTasksByProject,
        getTasksByTag,
        getFilteredTasks,
        getTaskStats,
        getProjectById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextProps => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
