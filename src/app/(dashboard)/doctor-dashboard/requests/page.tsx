'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, AlertTriangle } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Appointment, Reminder } from '@/lib/types';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const mockRequests: Appointment[] = [
  {
    id: 'appt_req_1',
    patientId: 'patient_1',
    patientName: 'Amina Sheikh',
    doctorId: 'jalal-ahmed',
    status: 'Pending',
    scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    symptoms: 'Feeling chest pain and shortness of breath for the last two days. It gets worse with light activity.',
    createdAt: new Date().toISOString(),
    feePaid: false,
    paymentIntentId: '',
    videoLink: '',
  },
  {
    id: 'appt_req_2',
    patientId: 'patient_2',
    patientName: 'Bilal Khan',
    doctorId: 'jalal-ahmed',
    status: 'Pending',
    scheduledAt: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    symptoms: 'Constant headache and dizziness for the past week.',
    createdAt: new Date().toISOString(),
    feePaid: false,
    paymentIntentId: '',
    videoLink: '',
  }
];

function RequestSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
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
    
    // Local state for mock data interaction
    const [mockData, setMockData] = useState<Appointment[]>(mockRequests);

    const isTestUser = user?.email === 'jalal@gmail.com';

    const handleUpdateStatus = async (appointmentId: string, status: 'Confirmed' | 'Cancelled') => {
        if (isTestUser) {
            // Handle mock data state
            setMockData(prev => prev.filter(req => req.id !== appointmentId));
             if (status === 'Confirmed') {
                const appointment = mockRequests.find(req => req.id === appointmentId);
                toast({
                    title: "Request Accepted",
                    description: `Appointment with ${appointment?.patientName} has been confirmed.`,
                });
            } else {
                 toast({
                    title: "Request Declined",
                    description: "The appointment request has been declined.",
                    variant: "destructive"
                });
            }
            return;
        }

        if (!firestore) return;
        const appointmentRef = doc(firestore, 'appointments', appointmentId);
        await updateDocumentNonBlocking(appointmentRef, { status });

        if (status === 'Confirmed') {
            const appointment = mockRequests.find(req => req.id === appointmentId);
            if (appointment) {
                // Also create a reminder for the patient
                const remindersCol = collection(firestore, 'reminders');
                const reminder: Omit<Reminder, 'id'> = {
                    userId: appointment.patientId,
                    type: 'appointment',
                    title: `Appointment with ${appointment.doctorName}`,
                    time: appointment.scheduledAt,
                    message: `Your appointment with ${appointment.doctorName} is confirmed.`,
                    createdAt: new Date().toISOString(),
                };
                await addDocumentNonBlocking(remindersCol, reminder);
            }
             toast({
                title: "Request Accepted",
                description: `Appointment has been confirmed and a reminder sent to the patient.`,
            });
        }
    };
    
    const requests = isTestUser ? mockData : []; // In real app, this would use useCollection
    const showLoading = isUserLoading;


  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Appointment Requests</h1>
      
      {showLoading ? (
         <div className="space-y-4">
            <RequestSkeleton />
            <RequestSkeleton />
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${req.patientId}`} />
                      <AvatarFallback>{req.patientName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{req.patientName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1">
                        <Clock className="h-4 w-4" /> 
                        {new Date(req.scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-1">Symptoms / Reason for Visit:</p>
                <p className="text-muted-foreground">{req.symptoms}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleUpdateStatus(req.id, 'Cancelled')}>
                    <X className="mr-2 h-4 w-4" /> Decline
                </Button>
                <Button onClick={() => handleUpdateStatus(req.id, 'Confirmed')}>
                    <Check className="mr-2 h-4 w-4" /> Accept
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
            <p className="text-muted-foreground">You have no new appointment requests.</p>
        </Card>
      )}
    </div>
  );
}
