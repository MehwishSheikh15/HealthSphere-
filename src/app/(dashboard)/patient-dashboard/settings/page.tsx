'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PatientSettingsPage() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
        });
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
           <CardDescription>This page will allow you to update your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Profile editing is coming soon.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive alerts and reminders from HealthSphere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="appointment-reminders" className="text-base">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive notifications for your upcoming appointments.
                    </p>
                </div>
                <Switch
                    id="appointment-reminders"
                    defaultChecked
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="medication-reminders" className="text-base">Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                        Get alerts when it's time to take your medication.
                    </p>
                </div>
                <Switch
                    id="medication-reminders"
                    defaultChecked
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                       Receive reminders and updates via email.
                    </p>
                </div>
                <Switch
                    id="email-notifications"
                />
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
