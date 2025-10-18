import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientSubscriptionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will display your current subscription plan and provide options to upgrade or manage your billing details.</p>
        </CardContent>
      </Card>
    </div>
  );
}
