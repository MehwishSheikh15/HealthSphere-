'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { User as UserEntity } from "@/lib/types";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Skeleton } from "@/components/ui/skeleton";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
});

const notificationsFormSchema = z.object({
    appointmentReminders: z.boolean().default(true),
    medicationReminders: z.boolean().default(true),
    emailNotifications: z.boolean().default(false),
})

export default function PatientSettingsPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    
    const userDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);
    
    const [isProfileSaving, setIsProfileSaving] = useState(false);
    const [isNotificationSaving, setIsNotificationSaving] = useState(false);

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            phone: ''
        },
    });

    const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
        resolver: zodResolver(notificationsFormSchema),
        defaultValues: {
            appointmentReminders: true,
            medicationReminders: true,
            emailNotifications: false,
        }
    });

    useEffect(() => {
        if (userProfile) {
            profileForm.reset({
                name: userProfile.name || user?.displayName || '',
                phone: userProfile.phone || user?.phoneNumber || '',
            });
            notificationsForm.reset({
                appointmentReminders: userProfile.notificationSettings?.appointmentReminders ?? true,
                medicationReminders: userProfile.notificationSettings?.medicationReminders ?? true,
                emailNotifications: userProfile.notificationSettings?.emailNotifications ?? false,
            })
        }
    }, [userProfile, user, profileForm, notificationsForm]);

    async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
        if (!userDocRef) return;
        setIsProfileSaving(true);
        try {
            await updateDocumentNonBlocking(userDocRef, values);
            toast({
                title: "Profile Updated",
                description: "Your profile information has been successfully saved.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: "Could not save your profile. Please try again.",
            });
        }
        setIsProfileSaving(false);
    }
    
    async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
        if (!userDocRef) return;
        setIsNotificationSaving(true);
        try {
            await updateDocumentNonBlocking(userDocRef, { notificationSettings: values });
            toast({
                title: "Settings Saved",
                description: "Your notification preferences have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save your notification settings. Please try again.",
            });
        }
        setIsNotificationSaving(false);
    }
    
    const showLoading = isUserLoading || isProfileLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Settings</h1>
      
      <Card>
        <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showLoading ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ) : (
                    <>
                        <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isProfileSaving || showLoading}>
                        {isProfileSaving ? "Saving..." : "Save Profile"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
      
      <Card>
        <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive alerts and reminders from HealthSphere.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {showLoading ? (
                        <div className="space-y-4">
                           <Skeleton className="h-20 w-full" />
                           <Skeleton className="h-20 w-full" />
                           <Skeleton className="h-20 w-full" />
                        </div>
                   ) : (
                    <>
                    <FormField
                        control={notificationsForm.control}
                        name="appointmentReminders"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Appointment Reminders</FormLabel>
                                    <FormDescription>
                                        Receive notifications for your upcoming appointments.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={notificationsForm.control}
                        name="medicationReminders"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Medication Reminders</FormLabel>
                                    <FormDescription>
                                        Get alerts when it's time to take your medication.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Notifications</FormLabel>
                                    <FormDescription>
                                    Receive reminders and updates via email.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    </>
                   )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isNotificationSaving || showLoading}>
                        {isNotificationSaving ? "Saving..." : "Save Preferences"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
