import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorAppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Appointments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will soon display your upcoming, pending, and past appointments, allowing you to manage your schedule effectively.</p>
        </CardContent>
      </Card>
    </div>
  );
}
