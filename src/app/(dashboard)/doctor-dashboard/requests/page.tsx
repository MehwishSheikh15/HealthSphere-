import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorRequestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Appointment Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Soon you will be able to view and manage all incoming appointment requests from patients right here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
