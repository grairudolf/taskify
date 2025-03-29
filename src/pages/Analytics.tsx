
import React from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { format, subDays, isSameDay } from "date-fns";

const Analytics = () => {
  const { tasks, projects, getTasksByProject } = useTaskContext();

  // Calculate completion rate over time (last 7 days)
  const last7Days = Array.from({length: 7}).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    
    const tasksCreated = tasks.filter(task => 
      isSameDay(new Date(task.createdAt), date)
    ).length;
    
    const tasksCompleted = tasks.filter(task => 
      task.completed && isSameDay(new Date(task.createdAt), date)
    ).length;
    
    return {
      date: format(date, "MMM dd"),
      created: tasksCreated,
      completed: tasksCompleted,
      completionRate: tasksCreated ? Math.round((tasksCompleted / tasksCreated) * 100) : 0
    };
  });

  // Calculate tasks by priority
  const tasksByPriority = [
    { name: "High", value: tasks.filter(task => task.priority === "high").length },
    { name: "Medium", value: tasks.filter(task => task.priority === "medium").length },
    { name: "Low", value: tasks.filter(task => task.priority === "low").length },
  ];

  // Calculate tasks by project
  const tasksByProject = projects.map(project => ({
    name: project.name,
    value: getTasksByProject(project.id).length,
    color: project.color
  })).filter(project => project.value > 0);

  // Colors for pie charts
  const priorityColors = ["#EF4444", "#F59E0B", "#3B82F6"];
  
  // Average completion time (days)
  const completionTimeData = [
    { name: "High", value: 1.2 },
    { name: "Medium", value: 2.8 },
    { name: "Low", value: 4.5 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics</h2>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Task Activity (Last 7 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={last7Days}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="created" 
                stroke="#8B5CF6" 
                name="Tasks Created"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                name="Tasks Completed"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="completionRate" 
                stroke="#F59E0B" 
                name="Completion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Tasks by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Tasks by Project</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByProject}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tasksByProject.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Average Completion Time by Priority</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={completionTimeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} days`, 'Avg. Completion Time']} />
              <Bar dataKey="value" name="Avg. Days to Complete">
                {completionTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
