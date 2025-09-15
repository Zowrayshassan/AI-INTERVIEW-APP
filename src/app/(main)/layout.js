import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./dashboard/_components/appsidebar";
import Welcome from "./dashboard/_components/welcome";

export default function Layout({ children }) {
  return (
    <div className="bg-secondary overflow-auto">
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Welcome></Welcome>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
