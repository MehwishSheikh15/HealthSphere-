'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useSidebar, SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Logo } from '@/components/layout/logo';
import { navItems } from '@/lib/config';
import { type Role, type NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// This would come from your auth context in a real app
const useUserRole = (): Role => {
  const pathname = usePathname();
  if (pathname.startsWith('/doctor-dashboard')) return 'doctor';
  if (pathname.startsWith('/admin-panel')) return 'admin';
  return 'patient';
};

const useUser = () => {
    const role = useUserRole();
    if(role === 'doctor') {
        return { name: "Dr. Jalal", email: "jalal@gmail.com" };
    }
    if(role === 'patient') {
        return { name: "Ameen", email: "ameen@example.com" };
    }
    return { name: "Admin", email: "admin@healthsphere.com"};
}

function DashboardNav() {
  const pathname = usePathname();
  const role = useUserRole();
  const currentNavItems = navItems[role];

  return (
    <nav className="flex flex-col gap-2">
      {currentNavItems.map((item: NavItem, index: number) => (
        <Link key={index} href={item.disabled ? '#' : item.href}>
          <Button
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            disabled={item.disabled}
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );
}

function ModernDashboardNav() {
  const pathname = usePathname();
  const role = useUserRole();
  const { open } = useSidebar();
  const currentNavItems = navItems[role];

  return (
     <SidebarMenu>
        {currentNavItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <Link href={item.href}>
              <SidebarMenuButton 
                isActive={pathname === item.href} 
                tooltip={{ children: item.title, hidden: open }}
              >
                  {item.icon}
                  <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const role = useUserRole();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Logo />
                    <span className="font-headline font-semibold text-lg group-data-[collapsible=icon]:hidden">HealthSphere</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <ModernDashboardNav />
            </SidebarContent>
            <SidebarFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://picsum.photos/seed/${user.email}/40/40`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                   <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-4">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="text-xl font-semibold capitalize">{role} Dashboard</h1>
              </div>
              {/* Other header content */}
            </div>
          </header>
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
