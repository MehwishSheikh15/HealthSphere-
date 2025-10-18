import { type NavItem, type Role } from '@/lib/types';
import { LayoutDashboard, Stethoscope, User, Calendar, Wallet, ShieldCheck, BarChart, Settings, Bot } from 'lucide-react';

export const navItems: Record<Role, NavItem[]> = {
  patient: [
    {
      title: 'Dashboard',
      href: '/patient-dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: 'Appointments',
      href: '/patient-dashboard/appointments',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'AI Tools',
      href: '/patient-dashboard/ai-tools',
      icon: <Bot className="h-4 w-4" />,
    },
    {
      title: 'Reminders',
      href: '/patient-dashboard/reminders',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Subscriptions',
      href: '/patient-dashboard/subscriptions',
      icon: <Wallet className="h-4 w-4" />,
    },
     {
      title: 'Settings',
      href: '/patient-dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
    },
  ],
  doctor: [
    {
      title: 'Dashboard',
      href: '/doctor-dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: 'Requests',
      href: '/doctor-dashboard/requests',
      icon: <User className="h-4 w-4" />,
    },
    {
      title: 'Appointments',
      href: '/doctor-dashboard/appointments',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Wallet',
      href: '/doctor-dashboard/wallet',
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: 'Reminders',
      href: '/doctor-dashboard/reminders',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Settings',
      href: '/doctor-dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
    },
  ],
  admin: [
    {
      title: 'Dashboard',
      href: '/admin-panel',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: 'Verifications',
      href: '/admin-panel/verifications',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      title: 'Analytics',
      href: '/admin-panel/analytics',
      icon: <BarChart className="h-4 w-4" />,
    },
  ],
};
