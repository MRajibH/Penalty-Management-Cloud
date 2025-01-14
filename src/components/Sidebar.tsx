import {
  Book,
  BookA,
  BookAudio,
  BookCheck,
  BookDashed,
  BookHeart,
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  Braces,
  Inbox,
  Settings2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Nav } from "./Nav";
import Profile from "./Profile";
import { Separator } from "./ui/separator";
import { FaBookOpenReader } from "react-icons/fa6";

interface SidebarProps {
  isCollapsed: boolean;
}

export const Logo = ({ className }: { className?: string }) => (
  <span className={cn("w-8 h-8 flex items-center", className)}>
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M16 8C16 10.3005 15.029 12.3742 13.4744 13.8336L12.0147 11.8244L13.4959 7.26574L15.8592 6.49785C15.9516 6.98439 16 7.48655 16 8Z"
          fill="#0f172a"
        ></path>{" "}
        <path
          d="M10.3966 13L11.8573 15.0104C10.7134 15.6411 9.39861 16 8 16C6.60139 16 5.28661 15.6411 4.14273 15.0104L5.60335 13H10.3966Z"
          fill="#0f172a"
        ></path>{" "}
        <path
          d="M0 8C0 10.3005 0.971022 12.3742 2.52556 13.8336L3.98532 11.8244L2.50412 7.26575L0.140801 6.49786C0.0483698 6.9844 0 7.48655 0 8Z"
          fill="#0f172a"
        ></path>{" "}
        <path
          d="M3.12212 5.36363L0.758423 4.59561C1.90208 2.16713 4.23136 0.40714 6.99999 0.0618925V2.54619L3.12212 5.36363Z"
          fill="#0f172a"
        ></path>{" "}
        <path
          d="M8.99999 2.54619V0.0618896C11.7686 0.40713 14.0979 2.16712 15.2416 4.5956L12.8779 5.36362L8.99999 2.54619Z"
          fill="#0f172a"
        ></path>{" "}
        <path
          d="M4.47328 6.85409L7.99999 4.29179L11.5267 6.85409L10.1796 11H5.82037L4.47328 6.85409Z"
          fill="#0f172a"
        ></path>{" "}
      </g>
    </svg>
  </span>
);

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      <div
        className={cn("flex items-center h-[52px]", isCollapsed ? "" : "px-2")}
      >
        {/* <Logo className={isCollapsed ? "mr-0" : "mr-4"} /> */}
        {!isCollapsed && (
          <h3 className="font-bold text-xl">Penalty Management</h3>
        )}
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
          },
          {
            type: "link",
            title: "Dashboard",
            url: "/app/dashboard",
            label: "",
            icon: Inbox,
            variant: "default",
          },
          {
            type: "link",
            title: "Penalty Data",
            url: "/app/penalty_data",
            label: "",
            icon: Braces,
            variant: "ghost",
          },
          {
            type: "label",
            title: "Management",
          },
          {
            type: "link",
            title: "User Management",
            url: "/app/user_management",
            label: "",
            icon: Users2,
            variant: "ghost",
          },
          {
            type: "link",
            title: "Manage Constitution",
            url: "/app/manage_contitution",
            label: "",
            icon: BookOpen,
            variant: "ghost",
          },
          {
            type: "label",
            title: "Settings",
          },
          {
            type: "link",
            title: "Settings",
            url: "/app/settings",
            label: "",
            icon: Settings2,
            variant: "ghost",
          },
        ]}
      />
      <Separator />
      <Profile className="p-3" />
    </div>
  );
};
