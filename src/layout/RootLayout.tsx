import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Dashboard from "@/pages/Dashboard";

const RootLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <nav className="h-[40px] flex items-center px-2">
          <SidebarTrigger />
        </nav>
        <main className="w-full h-[calc(100vh-40px)]">
          <Dashboard />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
