import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerificationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Doctor Verifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will display a list of doctors awaiting verification. Admins can review their documents and AI-generated scores to approve or reject them.</p>
        </CardContent>
      </Card>
    </div>
  );
}
