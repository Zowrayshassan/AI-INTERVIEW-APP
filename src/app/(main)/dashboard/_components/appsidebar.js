"use client"; // very important, must be at very top

import { Button } from "@/components/ui/button";
import { Calendar, Home, Menu, Plus, Receipt, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Scheduled Interview", url: "/hello", icon: Calendar },
  { title: "All Interview", url: "/all-interviews", icon: Menu },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Image
              src="/logo.png"
              width={900}
              height={500}
              alt="logo"
              className="mt-25"
            />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <Button className="w-55 ml-2 mt-[40%]">
              <Plus /> Create Interview
            </Button>

            <SidebarMenu className="mt-10 ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-3 ml-2">
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 ${
                        pathname === item.url
                          ? "bg-gray-200 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
