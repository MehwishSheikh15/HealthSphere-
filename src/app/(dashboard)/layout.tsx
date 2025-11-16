'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar, SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { Logo } from '@/components/layout/logo';
import { navItems } from '@/lib/config';
import { type Role, type User as UserEntity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/layout/footer';

// This would come from your auth context in a real app
const useUserRole = (): { role: Role, isLoading: boolean } => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user?.uid || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user?.uid, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return { role: 'patient', isLoading: true };
  }
  
  // The primary source of truth for role is the user's profile in Firestore.
  if (userProfile?.role) {
    return { role: userProfile.role, isLoading: false };
  }
  
  // A simple fallback based on email for demonstration.
  // This should only be hit if the Firestore document hasn't been created yet.
  if (user?.email === 'jalal@gmail.com') return { role: 'doctor', isLoading: false };
  if (user?.email?.includes('admin')) return { role: 'admin', isLoading: false };

  return { role: 'patient', isLoading: false };
};

const useUserDisplay = () => {
    const { user } = useUser();
    const { role } = useUserRole();

    if (role === 'doctor') {
        return { name: user?.displayName || "Dr. User", email: user?.email || "doctor@example.com" };
    }
    if (role === 'admin') {
        return { name: "Admin", email: user?.email || "admin@healthsphere.com"};
    }
    return { name: user?.displayName || "Patient", email: user?.email || "patient@example.com" };
}

function ModernDashboardNav() {
  const pathname = usePathname();
  const { role } = useUserRole();
  const { open } = useSidebar();
  const currentNavItems = navItems[role];

  return (
     <SidebarMenu>
        {currentNavItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={index}>
              <Link href={item.href}>
                <SidebarMenuButton 
                  isActive={pathname === item.href} 
                  tooltip={{ children: item.title, hidden: open }}
                >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userDisplay = useUserDisplay();
  const { role, isLoading: isRoleLoading } = useUserRole();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth);
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
    })
    router.push('/');
  };

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isUserLoading, user, router]);

  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading dashboard...</p>
        </div>
    );
  }

  if (!user) {
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex flex-1">
            <Sidebar collapsible="icon" className="bg-white border-r shadow-sm">
              <SidebarRail />
                <SidebarHeader>
                    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                        <Link href="/patient-dashboard"><Logo className="w-8" iconOnly /></Link>
                        <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">HealthSphere</span>
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
                            <AvatarImage src={`https://picsum.photos/seed/${userDisplay.email}/40/40`} />
                            <AvatarFallback>{userDisplay.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                              <p className="text-sm font-medium leading-none">{userDisplay.name}</p>
                              <p className="text-xs leading-none text-muted-foreground truncate">{userDisplay.email}</p>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                       <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarFooter>
            </Sidebar>
            <div className="flex-1 flex flex-col">
              <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                  <div className="flex items-center gap-4">
                     <SidebarTrigger />
                     <Link href="/patient-dashboard" className="md:hidden">
                        <Logo className="w-8" iconOnly />
                     </Link>
                     <h1 className="text-xl font-semibold capitalize hidden md:block">{role} Dashboard</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://picsum.photos/seed/${userDisplay.email}/40/40`} alt={userDisplay.name} />
                                <AvatarFallback>{userDisplay.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>
              <main className="flex-1 p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
