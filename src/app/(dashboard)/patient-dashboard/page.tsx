import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Welcome, Patient!</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              You have 2 appointments scheduled.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              5 medication reminders are active.
            </p>
          </CardContent>
        </Card>
      </div>
       <Card className="mt-6">
        <CardHeader>
            <CardTitle>Your Health Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>This is where your main dashboard content will go. You can view summaries of your health, recent activities, and quick links to other sections.</p>
            <Button>Pay Doctor's Fee</Button>
        </CardContent>
      </Card>
    </div>
  );
}
