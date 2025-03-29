
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTaskContext } from "@/contexts/TaskContext";
import { format, startOfWeek, addDays } from "date-fns";

export const TaskChart = () => {
  const { tasks } = useTaskContext();

  const chartData = useMemo(() => {
    // Get dates for the current week
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
    
    // Initialize data for each day of the week
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        day: format(date, "EEE"),
        completed: 0,
        added: 0,
        date: date
      };
    });
    
    // Count tasks for each day
    tasks.forEach(task => {
      const taskDate = new Date(task.createdAt);
      const completionDate = task.completed ? new Date() : null; // Using current date for completion as we don't store completion date
      
      // Find the day index for the task creation
      weekData.forEach((day, index) => {
        // Check if task was created on this day of the current week
        if (
          taskDate.getDate() === day.date.getDate() &&
          taskDate.getMonth() === day.date.getMonth() &&
          taskDate.getFullYear() === day.date.getFullYear()
        ) {
          weekData[index].added += 1;
        }
        
        // Check if task was completed on this day of the current week
        if (
          task.completed && 
          completionDate &&
          completionDate.getDate() === day.date.getDate() &&
          completionDate.getMonth() === day.date.getMonth() &&
          completionDate.getFullYear() === day.date.getFullYear()
        ) {
          weekData[index].completed += 1;
        }
      });
    });
    
    return weekData;
  }, [tasks]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-500">Added: {payload[0].value}</p>
          <p className="text-sm text-green-500">Completed: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="font-medium">Task Activity This Week</h3>
      <div className="mt-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
            />
            <Bar dataKey="added" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
