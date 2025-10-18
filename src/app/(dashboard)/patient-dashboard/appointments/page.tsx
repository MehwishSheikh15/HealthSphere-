
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

function AppointmentCard({ appt, onFeatureClick }: { appt: Appointment, onFeatureClick: () => void }) {
    const isActionable = appt.status === 'Confirmed';
    const isPast = appt.status === 'Completed' || appt.status === 'Cancelled';

    return (
        <Card className={isPast ? "opacity-75" : ""}>
            <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{appt.doctorName || "Dr. Name"}</CardTitle>
                    <CardDescription>{appt.doctorSpecialization || "Specialization"}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
            </div>
            </CardHeader>
            <CardContent>
            <p><strong>Date:</strong> {new Date(appt.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> {new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {isActionable ? (
                    <>
                        <Button variant="outline" size="sm" onClick={onFeatureClick}>
                            <MessageSquare className="mr-2 h-4 w-4"/>Message
                        </Button>
                        <Button size="sm" onClick={onFeatureClick}>
                           <Video className="mr-2 h-4 w-4"/>Join Call
                        </Button>
                    </>
                ) : isPast ? (
                     <>
                        <Button variant="ghost" size="sm">View Details</Button>
                        <Button asChild size="sm">
                            <Link href={`/patient-dashboard/find-a-doctor/${appt.doctorId}`}>Book Again</Link>
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center text-sm text-muted-foreground p-2 bg-gray-50 rounded-md">
                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>Actions available after confirmation.</span>
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

export default function PatientAppointmentsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isFeatureUnavailableOpen, setIsFeatureUnavailableOpen] = useState(false);

    const appointmentsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'appointments'), where('patientId', '==', user.uid));
    }, [user, firestore]);

    const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

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
        <h2 className="text-2xl font-semibold">Upcoming & Pending</h2>
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
            <p className="text-muted-foreground">You have no upcoming appointments. <Link href="/patient-dashboard/find-a-doctor" className="text-primary underline">Find a doctor</Link> to book one.</p>
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
