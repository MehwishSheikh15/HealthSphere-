import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientRemindersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Reminders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Medication & Appointment Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will allow you to set, view, and manage all your medication and appointment reminders.</p>
        </CardContent>
      </Card>
    </div>
  );
}
