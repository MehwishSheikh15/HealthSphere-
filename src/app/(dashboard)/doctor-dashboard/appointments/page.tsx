'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare, AlertTriangle } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from "firebase/firestore";
import type { Appointment } from "@/lib/types";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'completed':
      return 'outline';
    case 'cancelled':
        return 'destructive';
    default:
      return 'destructive';
  }
};

const mockAppointments: Appointment[] = [
    {
        id: 'appt_2',
        patientId: 'patient_2',
        patientName: 'Fatima Ali',
        doctorId: 'jalal-ahmed',
        status: 'Completed',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        symptoms: 'Follow-up consultation regarding blood pressure medication.',
        createdAt: new Date().toISOString(),
        feePaid: true,
        paymentIntentId: 'pi_123',
        videoLink: '',
    },
];

function AppointmentCard({ appt, onFeatureClick }: { appt: Appointment, onFeatureClick: () => void }) {
    const isActionable = appt.status === 'Confirmed';
    const isPast = appt.status === 'Completed' || appt.status === 'Cancelled';

    return (
        <Card className={isPast ? "opacity-75" : ""}>
            <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{appt.patientName || "Patient Name"}</CardTitle>
                    <CardDescription>{new Date(appt.scheduledAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
            </div>
            </CardHeader>
            <CardContent>
                <p className="font-semibold text-sm">Symptoms:</p>
                <p className="text-sm text-muted-foreground">{appt.symptoms}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {isActionable ? (
                    <>
                        <Button variant="outline" size="sm" onClick={onFeatureClick}>
                            <MessageSquare className="mr-2 h-4 w-4"/>Message Patient
                        </Button>
                        <Button size="sm" onClick={onFeatureClick}>
                           <Video className="mr-2 h-4 w-4"/>Start Call
                        </Button>
                    </>
                ) : isPast ? (
                     <>
                        <Button variant="ghost" size="sm">View Details</Button>
                    </>
                ) : (
                    <div className="flex items-center text-sm text-muted-foreground p-2 bg-gray-50 rounded-md">
                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>Awaiting your confirmation.</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

function AppointmentSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-24 ml-auto" />
            </CardFooter>
        </Card>
    );
}

export default function DoctorAppointmentsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isFeatureUnavailableOpen, setIsFeatureUnavailableOpen] = useState(false);

    // This is a simple state to "fake" the confirmation of the dummy request
    const [confirmedMockAppointments, setConfirmedMockAppointments] = useState<Appointment[]>(mockAppointments);
    
    const appointmentsQuery = useMemoFirebase(() => {
        if (!user || !firestore || user.email === 'jalal@gmail.com') return null;
        return query(collection(firestore, 'appointments'), where('doctorId', '==', user.uid));
    }, [user, firestore]);

    const { data: liveAppointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

    const isTestUser = user?.email === 'jalal@gmail.com';
    // For the test user, we use the local state which can be updated by the requests page.
    // In a real scenario, this would all come from the live query.
    const appointments = isTestUser ? confirmedMockAppointments : liveAppointments;

    const upcomingAppointments = appointments?.filter(a => a.status === 'Confirmed' || a.status === 'Pending') ?? [];
    const pastAppointments = appointments?.filter(a => a.status === 'Completed' || a.status === 'Cancelled') ?? [];
    
    const showLoading = isLoading || isUserLoading;

  return (
    <div>
       <Dialog open={isFeatureUnavailableOpen} onOpenChange={setIsFeatureUnavailableOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Feature Not Available</DialogTitle>
            <DialogDescription>
                This feature is currently under development and will be available soon.
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
      </Dialog>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Appointments</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Upcoming & Confirmed</h2>
         {showLoading ? (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AppointmentSkeleton />
                <AppointmentSkeleton />
             </div>
         ) : upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appt={appt} onFeatureClick={() => setIsFeatureUnavailableOpen(true)} />)}
            </div>
         ) : (
            <p className="text-muted-foreground">You have no upcoming appointments.</p>
         )}
      </section>

      <section className="space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Past Appointments</h2>
        {showLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AppointmentSkeleton />
            </div>
        ) : pastAppointments.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map(appt => <AppointmentCard key={appt.id} appt={appt} onFeatureClick={() => setIsFeatureUnavailableOpen(true)} />)}
            </div>
        ) : (
            <p className="text-muted-foreground">You have no past appointments.</p>
        )}
      </section>
    </div>
  );
}
