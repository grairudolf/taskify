
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, CheckSquare, ListTodo, BarChart2, Calendar, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Tasks", path: "/tasks", icon: ListTodo },
    { name: "Projects", path: "/projects", icon: CheckSquare },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className={cn(
          "border-r border-border bg-sidebar transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        )}>
          <div className="flex h-16 items-center justify-between px-4">
            <div className={cn("flex items-center gap-2", !sidebarOpen && "md:hidden")}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CheckSquare size={18} />
              </div>
              <span className="font-semibold">Taskify</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <SidebarContent className="px-2">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}>
                    <a href={item.path}>
                      <item.icon size={18} />
                      <span className={cn("", !sidebarOpen && "md:hidden")}>
                        {item.name}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex h-full items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
                  <Menu size={18} />
                </SidebarTrigger>
                <h1 className="text-lg font-semibold">
                  {navigationItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {/* Add user profile or other top nav elements here */}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
