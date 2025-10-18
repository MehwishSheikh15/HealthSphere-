import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorAppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Appointments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Confirmed Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will list all your confirmed appointments. You will be able to see patient details and join the video call.</p>
        </CardContent>
      </Card>
    </div>
  );
}
