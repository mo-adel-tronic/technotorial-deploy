"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import APP_MENU from "@/constants/MenuList";

type SidebarItemType = {
  title: string;
  icon: React.JSX.Element;
  href: string;
  children?: SidebarItemType[];
};
const data: { menu: SidebarItemType[] } = {
  menu: APP_MENU,
};
export default function AppSidebar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = React.useState(true);
  const currentPath = usePathname();
  const SidebarMenuButtonClassName =
    "border-b-2 mb-3 hover:bg-app-background hover:text-app-text hover:border-app-secondary transition-all duration-600 ease-in-out";
  const SidebarMenuButtonClassNameInActive = "text-app-background";
  const SidebarMenuButtonClassNameActive =
    "bg-app-background text-app-text border-app-secondary";
  return (
    <SidebarProvider open={isOpen} defaultOpen={isOpen}>
      <Sidebar collapsible="icon" side="right">
        <SidebarHeader
          style={{
            gridTemplateColumns: "1fr auto",
          }}
          className="bg-app-primary text-xs grid text-white border-b-2 border-gray-200/40 py-4 items-center"
        >
          {isOpen && (
            <div className="w-2/3 text-lg text-center font-text-en"><span className="text-app-secondary-on-primary">T</span>echno <span className="text-app-secondary-on-primary">T</span>orial</div>
          )}
          <SidebarTrigger
            className="-ml-1 text-white"
            onClick={() => setIsOpen(!isOpen)}
          />
        </SidebarHeader>
        <SidebarContent className="bg-app-primary">
          <SidebarGroup>
            <SidebarMenu>
              {data.menu.map((item, index) => (
                <Collapsible
                  key={index}
                  defaultOpen={false}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      {item.children ? (
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={`${SidebarMenuButtonClassName} ${
                            currentPath.startsWith(item.href)
                              ? SidebarMenuButtonClassNameActive
                              : SidebarMenuButtonClassNameInActive
                          }`}
                        >
                          {item.icon}
                          <span className="text-md font-bold">{item.title}</span>
                          <ChevronLeft
                            className={`mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 hover:text-app-primary ${
                              currentPath.startsWith(item.href)
                                ? "text-app-primary"
                                : ""
                            }`}
                          />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={`${SidebarMenuButtonClassName} ${
                            currentPath === item.href
                              ? SidebarMenuButtonClassNameActive
                              : SidebarMenuButtonClassNameInActive
                          }`}
                        >
                          <Link href={item.href || "#"}>
                            {item.icon}
                            <span className="text-md font-bold">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children &&
                          item.children.length > 0 &&
                          item.children.map((childItem, childIndex) => (
                            <SidebarMenuSubItem key={childIndex}>
                              <SidebarMenuSubButton
                                asChild
                                className={`${SidebarMenuButtonClassName} ${
                                  currentPath === item.href
                                    ? SidebarMenuButtonClassNameActive
                                    : SidebarMenuButtonClassNameInActive
                                }`}
                              >
                                {childItem.icon}
                                <span className="text-md font-bold">{childItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
