import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorRemindersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Patient Reminders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create & Manage Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will allow you to create and manage medication or follow-up reminders for your patients.</p>
        </CardContent>
      </Card>
    </div>
  );
}
