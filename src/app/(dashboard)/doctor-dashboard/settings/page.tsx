import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile & Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will allow you to update your professional profile, manage availability, and configure your account settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
