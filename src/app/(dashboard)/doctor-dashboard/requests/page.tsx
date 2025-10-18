import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorRequestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Appointment Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Patient Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will list all pending appointment requests from patients. You can review the details and choose to accept or reject them.</p>
        </CardContent>
      </Card>
    </div>
  );
}
