import { type LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type Role = 'patient' | 'doctor' | 'admin';

export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: Role;
    notificationSettings?: {
        appointmentReminders?: boolean;
        medicationReminders?: boolean;
        emailNotifications?: boolean;
    }
}

export type Doctor = {
    id: string;
    uid: string;
    name: string;
    email: string;
    phone?: string;
    role: 'doctor';
    isVerified: boolean;
    verificationStatus: string;
    createdAt: string;
    specialization: string;
    experience: number;
    feePKR: number;
    licenseDocumentUrl?: string;
}

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

export type Reminder = {
    id: string;
    userId: string;
    type: 'medication' | 'appointment';
    title: string;
    time: string; // ISO string for time
    message: string;
    createdAt: string;
}

export type Transaction = {
    id: string;
    appointmentId: string;
    patientId: string;
    patientName?: string;
    doctorId: string;
    amountPKR: number;
    commission: number;
    doctorEarning: number;
    status: 'Paid' | 'Pending';
    createdAt: string;
}
