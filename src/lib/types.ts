import { type LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type Role = 'patient' | 'doctor' | 'admin';

export type Appointment = {
    id: string;
    doctorId: string;
    patientId: string;
    doctorName?: string;
    doctorSpecialization?: string;
    patientName?: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    feePaid: boolean;
    paymentIntentId: string;
    videoLink: string;
    scheduledAt: string;
    symptoms: string;
    createdAt: string;
};
