import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile & Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will allow you to update your profile information and manage your notification preferences.</p>
        </CardContent>
      </Card>
    </div>
  );
}
