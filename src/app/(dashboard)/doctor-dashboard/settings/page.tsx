'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from '@/lib/types';
import { verifyDoctorDocuments } from "@/ai/flows/doctor-verification-flow";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
});

const professionalFormSchema = z.object({
  specialization: z.string().min(3, "Specialization is required."),
  experience: z.coerce.number().min(0, "Experience must be a positive number."),
  feePKR: z.coerce.number().min(0, "Fee must be a positive number."),
});

const licenseFormSchema = z.object({
    document: z.any().refine(file => file?.length == 1, "A new license document is required."),
});

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

export default function DoctorSettingsPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    
    // For Dr. Jalal (test user), we use a specific doc ID.
    const isTestUser = user?.email === 'jalal@gmail.com';
    const doctorId = isTestUser ? 'jalal-ahmed' : user?.uid;
    
    const doctorDocRef = useMemoFirebase(() => {
        if (!doctorId || !firestore) return null;
        return doc(firestore, 'doctors', doctorId);
    }, [doctorId, firestore]);

    const { data: doctorProfile, isLoading: isProfileLoading } = useDoc<Doctor>(doctorDocRef);
    
    const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
    const [showVerificationFailedPopup, setShowVerificationFailedPopup] = useState(false);

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: { name: '', phone: '' },
    });

    const professionalForm = useForm<z.infer<typeof professionalFormSchema>>({
        resolver: zodResolver(professionalFormSchema),
        defaultValues: { specialization: '', experience: 0, feePKR: 0 },
    });

     const licenseForm = useForm<z.infer<typeof licenseFormSchema>>({
        resolver: zodResolver(licenseFormSchema)
    });

    useEffect(() => {
        if (doctorProfile) {
            profileForm.reset({
                name: doctorProfile.name || user?.displayName || '',
                phone: doctorProfile.phone || user?.phoneNumber || '',
            });
            professionalForm.reset({
                specialization: doctorProfile.specialization || '',
                experience: doctorProfile.experience || 0,
                feePKR: doctorProfile.feePKR || 0,
            });
        }
    }, [doctorProfile, user, profileForm, professionalForm]);

    async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
        if (!doctorDocRef) return;
        setIsSaving(prev => ({...prev, profile: true}));
        try {
            await updateDocumentNonBlocking(doctorDocRef, values);
            toast({ title: "Profile Updated", description: "Your personal information has been saved." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not save your profile." });
        }
        setIsSaving(prev => ({...prev, profile: false}));
    }

    async function onProfessionalSubmit(values: z.infer<typeof professionalFormSchema>) {
        if (!doctorDocRef) return;
        setIsSaving(prev => ({...prev, professional: true}));
        try {
            await updateDocumentNonBlocking(doctorDocRef, values);
            toast({ title: "Professional Details Updated", description: "Your professional details have been saved." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not save your professional details." });
        }
        setIsSaving(prev => ({...prev, professional: false}));
    }

    async function onLicenseSubmit(values: z.infer<typeof licenseFormSchema>) {
        if (!doctorDocRef || !doctorProfile) return;
        setIsSaving(prev => ({...prev, license: true}));
        try {
            const documentFile = values.document[0] as File;
            const documentDataUri = await fileToDataUri(documentFile);
            
            toast({ title: "Verifying New License...", description: "Please wait while our AI verifies your document." });

            const verificationResult = await verifyDoctorDocuments({
                documentDataUri,
                adminInstructions: `Verify the updated medical license for Dr. ${doctorProfile.name}.`,
            });

            if (verificationResult.verificationScore < 75) {
                setShowVerificationFailedPopup(true);
            } else {
                 await updateDocumentNonBlocking(doctorDocRef, { 
                    verificationStatus: 'Verified by AI (Updated)',
                    isVerified: true 
                });
                toast({ title: "License Verified & Updated!", description: "Your new license has been successfully verified." });
            }
        } catch (error) {
             toast({ variant: 'destructive', title: "Update Failed", description: "Could not verify or save your new license." });
        }
        setIsSaving(prev => ({...prev, license: false}));
    }
    
    const showLoading = isUserLoading || isProfileLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
      
      <AlertDialog open={showVerificationFailedPopup} onOpenChange={setShowVerificationFailedPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verification Failed</AlertDialogTitle>
            <AlertDialogDescription>
              We could not verify your new medical license. Please ensure the document is clear and try again. Your profile remains verified with your previous document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowVerificationFailedPopup(false)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Info Card */}
      <Card>
        <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {showLoading ? <Skeleton className="h-24 w-full" /> : (
                    <>
                        <FormField control={profileForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={profileForm.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="Your phone number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving.profile || showLoading}>{isSaving.profile ? "Saving..." : "Save Personal Info"}</Button>
                </CardFooter>
            </form>
        </Form>
      </Card>

       {/* Professional Details Card */}
       <Card>
        <Form {...professionalForm}>
            <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)}>
                <CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {showLoading ? <Skeleton className="h-40 w-full" /> : (
                    <>
                        <FormField control={professionalForm.control} name="specialization" render={({ field }) => (
                            <FormItem><FormLabel>Specialization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={professionalForm.control} name="experience" render={({ field }) => (
                            <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={professionalForm.control} name="feePKR" render={({ field }) => (
                            <FormItem><FormLabel>Consultation Fee (PKR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving.professional || showLoading}>{isSaving.professional ? "Saving..." : "Save Professional Details"}</Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
      
      {/* License Upload Card */}
      <Card>
        <Form {...licenseForm}>
            <form onSubmit={licenseForm.handleSubmit(onLicenseSubmit)}>
                <CardHeader>
                <CardTitle>Update License Document</CardTitle>
                <CardDescription>Upload a new copy of your medical license for re-verification if it has changed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField control={licenseForm.control} name="document" render={({ field }) => (
                        <FormItem>
                        <FormLabel>New License Document</FormLabel>
                        <FormControl><Input type="file" accept=".pdf,image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving.license || showLoading}>{isSaving.license ? "Verifying & Saving..." : "Update License"}</Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
