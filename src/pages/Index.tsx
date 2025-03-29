
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { TaskProvider } from "@/contexts/TaskContext";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  return (
    <TaskProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </TaskProvider>
  );
};

export default Index;
