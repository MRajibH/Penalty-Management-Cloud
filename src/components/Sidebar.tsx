import { cn } from "@/lib/utils";
import { Nav } from "./Nav";
import Profile from "./Profile";
import { Separator } from "./ui/separator";
import { BookOpen, FileText, Home, Settings2, ShieldAlert, Users2 } from "lucide-react";
import { useAuthContext, useDataContext } from "@/context";
interface SidebarProps {
  isCollapsed: boolean;
}

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { currentUser } = useAuthContext();
  const { userPermissions } = useDataContext();

  return (
    <div className="flex flex-col h-full">
      <div className={cn("flex items-center h-[52px]", isCollapsed ? "justify-center" : "px-2")}>
        <img src={logoSrc} alt="Penalty Management logo" className="w-8 mx-2" />
        {/* <Logo className={isCollapsed ? "mr-0" : "mr-4"} /> */}
        {!isCollapsed && <h3 className="font-bold text-xl">Penalty Management</h3>}
        {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
      </div>

      <Separator />

      <Nav
        className="px-1 py-4"
        isCollapsed={isCollapsed}
        links={[
          {
            type: "label",
            title: "Overview",
            hasPermission:
              userPermissions?.overview?.dashboard.includes("view") ||
              userPermissions?.overview?.penalties.includes("view"),
          },
          {
            type: "link",
            title: "Dashboard",
            url: "/app/dashboard",
            label: "",
            icon: Home,
            variant: "default",
            hasPermission: userPermissions?.overview?.dashboard.includes("view"),
          },
          {
            type: "link",
            title: "Penalties",
            url: "/app/penalties",
            label: "",
            icon: ShieldAlert,
            variant: "ghost",
            hasPermission: userPermissions?.overview?.penalties.includes("view"),
          },
          {
            type: "label",
            title: "Management",
            hasPermission:
              userPermissions?.management?.users_management.includes("view") ||
              userPermissions?.management?.employee_management.includes("view") ||
              userPermissions?.management?.manage_constitution.includes("view"),
          },
          {
            type: "link",
            title: "User Management",
            url: "/app/user_management",
            label: "",
            icon: Users2,
            variant: "ghost",
            hasPermission: userPermissions?.management?.users_management.includes("view"),
          },
          {
            type: "link",
            title: "Employee Management",
            url: "/app/employee_management",
            label: "",
            icon: Users2,
            variant: "ghost",
            hasPermission: userPermissions?.management?.employee_management.includes("view"),
          },
          {
            type: "link",
            title: "Manage Constitution",
            url: "/app/manage_contitution",
            label: "",
            icon: BookOpen,
            variant: "ghost",
            hasPermission: userPermissions?.management?.manage_constitution.includes("view"),
          },
          {
            type: "label",
            title: "Settings",
            hasPermission:
              userPermissions?.settings?.app_logs.includes("view") ||
              userPermissions?.settings?.app_settings.includes("view"),
          },
          {
            type: "link",
            title: "App Logs",
            url: "/app/app_logs",
            label: "",
            icon: FileText,
            variant: "ghost",
            hasPermission: userPermissions?.settings?.app_logs.includes("view"),
          },
          {
            type: "link",
            title: "App Settings",
            url: "/app/app_settings",
            label: "",
            icon: Settings2,
            variant: "ghost",
            hasPermission: userPermissions?.settings?.app_settings.includes("view"),
          },
        ]}
      />

      {currentUser && (
        <>
          <Separator />
          <Profile className={`p-3 mx-${isCollapsed ? "auto" : "0"}`} iconOnly={isCollapsed} />
        </>
      )}
    </div>
  );
};
