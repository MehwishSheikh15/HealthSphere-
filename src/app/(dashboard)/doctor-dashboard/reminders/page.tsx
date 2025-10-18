'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Appointment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CalendarCheck } from "lucide-react";

// Mock data to simulate confirmed appointments for Dr. Jalal
const mockReminders: Appointment[] = [
    {
        id: 'appt_rem_1',
        patientId: 'patient_1',
        patientName: 'Amina Sheikh',
        doctorId: 'jalal-ahmed',
        status: 'Confirmed',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        symptoms: 'Feeling chest pain and shortness of breath.',
        createdAt: new Date().toISOString(),
        feePaid: true,
        paymentIntentId: '',
        videoLink: '',
    },
    {
        id: 'appt_rem_2',
        patientId: 'patient_3',
        patientName: 'Hassan Ali',
        doctorId: 'jalal-ahmed',
        status: 'Confirmed',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
        symptoms: 'Follow-up session for anxiety management.',
        createdAt: new Date().toISOString(),
        feePaid: true,
        paymentIntentId: '',
        videoLink: '',
    }
];

function ReminderCard({ appointment }: { appointment: Appointment }) {
    return (
        <Card>
            <CardHeader className='flex-row items-start gap-4 space-y-0'>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>Appointment: {appointment.patientName}</CardTitle>
                    <CardDescription>
                        {new Date(appointment.scheduledAt).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="font-semibold text-sm">Reason:</p>
                <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
            </CardContent>
        </Card>
    );
}

function ReminderSkeleton() {
    return (
        <Card>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-56" />
                </div>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
        </Card>
    );
}

export default function DoctorRemindersPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const isTestUser = user?.email === 'jalal@gmail.com';

    const appointmentsQuery = useMemoFirebase(() => {
        if (!user || !firestore || isTestUser) return null;
        return query(collection(firestore, 'appointments'), where('doctorId', '==', user.uid), where('status', '==', 'Confirmed'));
    }, [user, firestore, isTestUser]);

    const { data: confirmedAppointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

    const reminders = isTestUser ? mockReminders : confirmedAppointments;
    const showLoading = isLoading || isUserLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Upcoming Appointment Reminders</h1>
      
      {showLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReminderSkeleton />
            <ReminderSkeleton />
        </div>
      ) : reminders && reminders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reminders.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()).map(appt => (
                <ReminderCard key={appt.id} appointment={appt} />
            ))}
        </div>
      ) : (
        <Card className="text-center p-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Upcoming Reminders</h3>
            <p className="mt-1 text-sm text-muted-foreground">You have no confirmed appointments in the near future.</p>
        </Card>
      )}
    </div>
  );
}
