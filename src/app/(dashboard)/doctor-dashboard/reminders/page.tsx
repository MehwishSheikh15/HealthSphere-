
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from "firebase/firestore";
import type { Appointment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, FileText } from 'lucide-react';

function AppointmentReminderCard({ appointment }: { appointment: Appointment }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><User className="text-primary" /> {appointment.patientName || 'Patient'}</CardTitle>
            <CardDescription className="mt-2 flex items-start gap-2"><FileText className="text-muted-foreground mt-1" /><span>Symptoms: {appointment.symptoms}</span></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
           <Calendar className="text-muted-foreground" />
           <span>{new Date(appointment.scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ReminderSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-5 w-56" />
            </CardContent>
        </Card>
    );
}

export default function DoctorRemindersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const appointmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    
    // Special case for our test doctor account
    const doctorId = user.email === 'jalal@gmail.com' ? 'jalal-ahmed' : user.uid;

    return query(
      collection(firestore, 'appointments'), 
      where('doctorId', '==', doctorId),
      where('status', '==', 'Confirmed'),
      orderBy('scheduledAt', 'asc')
    );
  }, [user, firestore]);

  const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);
  const showLoading = isLoading || isUserLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Upcoming Appointment Reminders</h1>
      
      {showLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ReminderSkeleton />
          <ReminderSkeleton />
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map(appt => (
            <AppointmentReminderCard 
              key={appt.id} 
              appointment={appt} 
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium">No Upcoming Appointments</h3>
            <p className="text-muted-foreground mt-2">You have no confirmed appointments in your schedule.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
