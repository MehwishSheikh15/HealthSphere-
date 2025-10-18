import { type NavItem, type Role } from '@/lib/types';
import { LayoutDashboard, User, Calendar, Wallet, ShieldCheck, BarChart, Settings, Bot, Stethoscope } from 'lucide-react';

export const navItems: Record<Role, NavItem[]> = {
  patient: [
    {
      title: 'Dashboard',
      href: '/patient-dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Find a Doctor',
      href: '/patient-dashboard/find-a-doctor',
      icon: Stethoscope,
    },
    {
      title: 'Appointments',
      href: '/patient-dashboard/appointments',
      icon: Calendar,
    },
    {
      title: 'AI Tools',
      href: '/patient-dashboard/ai-tools',
      icon: Bot,
    },
    {
      title: 'Reminders',
      href: '/patient-dashboard/reminders',
      icon: Calendar,
    },
    {
      title: 'Subscriptions',
      href: '/patient-dashboard/subscriptions',
      icon: Wallet,
    },
     {
      title: 'Settings',
      href: '/patient-dashboard/settings',
      icon: Settings,
    },
  ],
  doctor: [
    {
      title: 'Dashboard',
      href: '/doctor-dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Requests',
      href: '/doctor-dashboard/requests',
      icon: User,
    },
    {
      title: 'Appointments',
      href: '/doctor-dashboard/appointments',
      icon: Calendar,
    },
    {
      title: 'Wallet',
      href: '/doctor-dashboard/wallet',
      icon: Wallet,
    },
    {
      title: 'Reminders',
      href: '/doctor-dashboard/reminders',
      icon: Calendar,
    },
    {
      title: 'Settings',
      href: '/doctor-dashboard/settings',
      icon: Settings,
    },
  ],
  admin: [
    {
      title: 'Dashboard',
      href: '/admin-panel',
      icon: LayoutDashboard,
    },
    {
      title: 'Verifications',
      href: '/admin-panel/verifications',
      icon: ShieldCheck,
    },
    {
      title: 'Analytics',
      href: '/admin-panel/analytics',
      icon: BarChart,
    },
  ],
};
