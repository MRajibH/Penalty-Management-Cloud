import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

type links1 = {
  type: "link";
  url: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
};

type links2 = {
  type: "label";
  title: string;
};

interface NavProps {
  className?: string;
  isCollapsed: boolean;
  links: (links1 | links2)[];
}

export function Nav({ links, className, isCollapsed }: NavProps) {
  const { pathname } = useLocation();

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group flex-1 flex flex-col gap-4 py-2 data-[collapsed=true]:py-2",
        className
      )}
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          if (link.type === "label") {
            if (isCollapsed) return <></>;

            return (
              <h6 className="text-xs font-bold text-gray-400 px-1 pt-2 pb-1">
                {link.title}
              </h6>
            );
          }

          const isActive = pathname === link.url;
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={link.url}
                  className={cn(
                    buttonVariants({
                      size: "icon",
                      variant: isActive ? "default" : "ghost",
                    }),
                    "h-9 w-9",
                    isActive &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to={link.url}
              className={cn(
                buttonVariants({ variant: isActive ? "default" : "ghost" }),
                "justify-start text-gray-600",
                isActive &&
                  "text-white  dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
