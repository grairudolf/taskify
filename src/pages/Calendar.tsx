
import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { format, isSameDay } from "date-fns";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DayProps } from "react-day-picker";

const Calendar = () => {
  const { tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  // Generate map of dates with tasks for calendar decoration
  const getDatesWithTasks = () => {
    const datesWithTasks = new Map<string, { count: number, complete: boolean }>();
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd");
        const current = datesWithTasks.get(dateKey) || { count: 0, complete: true };
        
        datesWithTasks.set(dateKey, {
          count: current.count + 1,
          complete: current.complete && task.completed
        });
      }
    });
    
    return datesWithTasks;
  };

  // Filter tasks for selected date
  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
    );
  };

  const datesWithTasks = getDatesWithTasks();
  const selectedDateTasks = getTasksForSelectedDate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <Button className="mt-2 sm:mt-0" onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiersStyles={{
              selected: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))"
              }
            }}
            components={{
              DayContent: (props: DayProps) => {
                const dateKey = format(props.date, "yyyy-MM-dd");
                const tasksForDate = datesWithTasks.get(dateKey);
                const isSelected = selectedDate && isSameDay(props.date, selectedDate);
                
                return (
                  <div 
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center p-0", 
                      isSelected && "text-primary-foreground"
                    )}
                  >
                    {props.day.toString()}
                    {tasksForDate && (
                      <div 
                        className={cn(
                          "absolute bottom-1 h-1 w-1 rounded-full",
                          tasksForDate.complete ? "bg-green-500" : "bg-blue-500"
                        )}
                      />
                    )}
                  </div>
                );
              }
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-medium">
              {selectedDate ? (
                <>Tasks for {format(selectedDate, "MMMM d, yyyy")}</>
              ) : (
                <>Select a date</>
              )}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEditTask}
                />
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <p className="text-muted-foreground">
                  {selectedDate ? 'No tasks for this date' : 'Select a date to view tasks'}
                </p>
                {selectedDate && (
                  <Button 
                    variant="link" 
                    className="mt-2" 
                    onClick={() => {
                      setEditTask(undefined);
                      setShowTaskForm(true);
                    }}
                  >
                    Add task for {format(selectedDate, "MMM d")}
                  </Button>
                )}
              </div>
            )}
          </div>
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

export default Calendar;
