
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc } from "firebase/firestore";
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Appointment, Reminder } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Calendar, User, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

function RequestCard({ appointment, onAccept, onDecline, isProcessing }: { appointment: Appointment, onAccept: () => void, onDecline: () => void, isProcessing: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><User className="text-primary" /> {appointment.patientName || 'Patient'}</CardTitle>
            <CardDescription className="mt-2 flex items-start gap-2"><FileText className="text-muted-foreground mt-1" /><span>Symptoms: {appointment.symptoms}</span></CardDescription>
          </div>
          <Badge variant="secondary">Pending</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm font-semibold">
           <Calendar className="text-muted-foreground" />
           <span>{new Date(appointment.scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDecline} disabled={isProcessing}>
            <X className="mr-2 h-4 w-4" /> Decline
        </Button>
        <Button onClick={onAccept} disabled={isProcessing}>
           <Check className="mr-2 h-4 w-4" /> Accept
        </Button>
      </CardFooter>
    </Card>
  )
}

function RequestSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-5 w-56" />
            </CardContent>
             <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    );
}


export default function DoctorRequestsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const requestsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    
    // Special case for our test doctor account
    const doctorId = user.email === 'jalal@gmail.com' ? 'jalal-ahmed' : user.uid;

    return query(
      collection(firestore, 'appointments'), 
      where('doctorId', '==', doctorId),
      where('status', '==', 'Pending')
    );
  }, [user, firestore]);

  const { data: requests, isLoading } = useCollection<Appointment>(requestsQuery);
  const showLoading = isLoading || isUserLoading;

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'Confirmed' | 'Cancelled') => {
    if (!firestore) return;
    setProcessingId(appointmentId);

    try {
        const appointmentDocRef = doc(firestore, 'appointments', appointmentId);
        updateDocumentNonBlocking(appointmentDocRef, { status: newStatus });
        
        // Optimistically create a reminder for the patient if confirmed
        if (newStatus === 'Confirmed') {
          const appointment = requests?.find(r => r.id === appointmentId);
          if (appointment) {
             const remindersCol = collection(firestore, 'reminders');
             const newReminder: Omit<Reminder, 'id'> = {
                userId: appointment.patientId,
                type: 'appointment',
                title: `Appt with ${appointment.doctorName}`,
                message: `Your appointment is confirmed.`,
                time: appointment.scheduledAt,
                createdAt: new Date().toISOString(),
             }
            addDocumentNonBlocking(remindersCol, newReminder);
          }
        }

        toast({
            title: `Request ${newStatus === 'Confirmed' ? 'Accepted' : 'Declined'}`,
            description: `The appointment has been ${newStatus.toLowerCase()}.`,
        });
    } catch(error) {
        console.error("Failed to update status: ", error);
        toast({
            variant: 'destructive',
            title: "Update Failed",
            description: "Could not update the appointment status. Please try again."
        });
    } finally {
        setProcessingId(null);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Appointment Requests</h1>
      
      {showLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <RequestSkeleton />
          <RequestSkeleton />
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map(req => (
            <RequestCard 
              key={req.id} 
              appointment={req} 
              onAccept={() => handleUpdateStatus(req.id, 'Confirmed')}
              onDecline={() => handleUpdateStatus(req.id, 'Cancelled')}
              isProcessing={processingId === req.id}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium">No Pending Requests</h3>
            <p className="text-muted-foreground mt-2">You have no new appointment requests from patients at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
