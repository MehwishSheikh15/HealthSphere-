'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare, AlertTriangle } from "lucide-react";

// Mock data for appointments
const appointments = [
  {
    id: 'appt-1',
    doctorName: "Dr. Jalal Ahmed",
    specialization: "Cardiologist",
    date: "2024-08-15",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 'appt-2',
    doctorName: "Dr. Ayesha Khan",
    specialization: "Dermatologist",
    date: "2024-08-18",
    time: "02:00 PM",
    status: "Pending",
  },
   {
    id: 'appt-3',
    doctorName: "Dr. Farhan Butt",
    specialization: "Pediatrician",
    date: "2024-07-25",
    time: "11:00 AM",
    status: "Completed",
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'completed':
      return 'outline';
    default:
      return 'destructive';
  }
};


export default function PatientAppointmentsPage() {
  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const pastAppointments = appointments.filter(a => a.status !== 'Confirmed' && a.status !== 'Pending');

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Appointments</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Upcoming & Pending</h2>
         {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map(appt => (
                <Card key={appt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{appt.doctorName}</CardTitle>
                            <CardDescription>{appt.specialization}</CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> {appt.time}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {appt.status === 'Confirmed' ? (
                      <>
                        <Button variant="outline" size="sm"><MessageSquare className="mr-2 h-4 w-4"/>Message</Button>
                        <Button size="sm"><Video className="mr-2 h-4 w-4"/>Join Call</Button>
                      </>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground p-2 bg-gray-50 rounded-md">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                          <span>Actions available after confirmation.</span>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
         ) : (
            <p className="text-muted-foreground">You have no upcoming appointments.</p>
         )}
      </section>

      <section className="space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Past Appointments</h2>
        {pastAppointments.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map(appt => (
                <Card key={appt.id} className="opacity-75">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{appt.doctorName}</CardTitle>
                            <CardDescription>{appt.specialization}</CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> {appt.time}</p>
                  </CardContent>
                   <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">View Details</Button>
                        <Button size="sm">Book Again</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        ) : (
            <p className="text-muted-foreground">You have no past appointments.</p>
        )}
      </section>
    </div>
  );
}
