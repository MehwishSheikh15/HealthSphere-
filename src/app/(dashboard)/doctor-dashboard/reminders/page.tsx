import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorRemindersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Reminders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A dedicated reminders page is on its way to help you keep track of your confirmed appointments and other important events.</p>
        </CardContent>
      </Card>
    </div>
  );
}
