import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientAppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Appointments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will list all your upcoming and past appointments. You'll be able to see details, join video calls for confirmed appointments, and book new ones.</p>
        </CardContent>
      </Card>
    </div>
  );
}
