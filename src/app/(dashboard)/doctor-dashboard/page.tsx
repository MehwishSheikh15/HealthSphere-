import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Welcome, Dr. Jalal!</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 12,350</div>
            <p className="text-xs text-muted-foreground">
              +1,350 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              New appointment requests to review.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              3 completed, 4 upcoming.
            </p>
          </CardContent>
        </Card>
      </div>
       <Card className="mt-6">
        <CardHeader>
            <CardTitle>Your Practice Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This is where your main dashboard content will go. You can view summaries of your earnings, patient requests, and schedule.</p>
        </CardContent>
      </Card>
    </div>
  );
}
