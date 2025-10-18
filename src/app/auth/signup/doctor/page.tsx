
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { verifyDoctorDocuments } from "@/ai/flows/doctor-verification-flow";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";


const doctorSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  specialization: z.string({ required_error: "Please select a specialization." }),
  licenseNumber: z.string().min(5, "License number is required."),
  experience: z.coerce.number().min(0, "Experience cannot be negative."),
  clinicName: z.string().optional(),
  document: z.any().refine(file => file?.length == 1, "Document is required."),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const specializations = ["Cardiologist", "Dermatologist", "Pediatrician", "Psychologist", "General Physician", "Orthopedic", "Neurologist"];

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

export default function DoctorSignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationFailedPopup, setShowVerificationFailedPopup] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof doctorSignupSchema>>({
    resolver: zodResolver(doctorSignupSchema),
     defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      specialization: undefined,
      licenseNumber: "",
      experience: 0,
      clinicName: "",
      document: undefined,
      terms: false,
    }
  });


  async function onSubmit(values: z.infer<typeof doctorSignupSchema>) {
    if (!auth || !firestore) return;
    setIsLoading(true);

    try {
        const documentFile = values.document[0] as File;
        const documentDataUri = await fileToDataUri(documentFile);

        toast({
            title: "Verifying Document...",
            description: "Our AI is verifying your license. Please wait.",
        });

        const verificationResult = await verifyDoctorDocuments({
            documentDataUri,
            adminInstructions: `Verify the medical license for Dr. ${values.fullName}, specializing in ${values.specialization}. License number provided: ${values.licenseNumber}.`,
        });

        if (verificationResult.verificationScore < 75) {
            setShowVerificationFailedPopup(true);
            setIsLoading(false);
            return;
        }

      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `Dr. ${values.fullName}`,
      });

      const doctorDocRef = doc(firestore, "doctors", user.uid);
      await setDoc(doctorDocRef, {
        id: user.uid,
        name: `Dr. ${values.fullName}`,
        email: values.email,
        phone: values.phone,
        specialization: values.specialization,
        degreeLicenseNumber: values.licenseNumber,
        experience: values.experience,
        location: "",
        isVerified: true,
        verificationStatus: 'Verified by AI',
        createdAt: new Date().toISOString(),
      });
      
      const userDocRef = doc(firestore, "users", user.uid);
       await setDoc(userDocRef, {
        id: user.uid,
        name: `Dr. ${values.fullName}`,
        email: values.email,
        phone: values.phone,
        role: "doctor",
        createdAt: new Date().toISOString(),
      });


      toast({
        title: "Application Submitted!",
        description: "Your registration has been successfully verified by our AI.",
      });
      router.push("/doctor-dashboard");

    } catch (error: any) {
      console.error("Doctor signup failed:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.code === 'auth/email-already-in-use' 
          ? "This email is already registered."
          : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
       <AlertDialog open={showVerificationFailedPopup} onOpenChange={setShowVerificationFailedPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verification Failed</AlertDialogTitle>
            <AlertDialogDescription>
              We could not verify your medical license with the document provided. Please ensure the document is clear and the license number is correct, then try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowVerificationFailedPopup(false)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="grid gap-2 text-center mb-4">
        <h2 className="text-2xl font-bold">Doctor Registration</h2>
        <p className="text-muted-foreground">Apply to join our network of trusted professionals.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jalal Ahmed" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="doctor@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="03001234567" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="specialization" render={({ field }) => (
            <FormItem><FormLabel>Specialization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a specialization" /></SelectTrigger></FormControl>
                    <SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
            <FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="licenseNumber" render={({ field }) => (
            <FormItem><FormLabel>Medical License Number</FormLabel><FormControl><Input placeholder="PMC-12345" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="experience" render={({ field }) => (
            <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="clinicName" render={({ field }) => (
            <FormItem><FormLabel>Clinic/Hospital Name (Optional)</FormLabel><FormControl><Input placeholder="HealthSphere Hospital" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="document" render={({ field }) => (
            <FormItem>
              <FormLabel>Degree / License Document</FormLabel>
              <FormControl>
                <Input type="file" accept=".pdf,image/*" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
               <FormDescription>Upload a PDF or image of your medical degree or license.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="terms" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
               <FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" /></FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                 <FormDescription>You agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</FormDescription>
              </div>
            </FormItem>
          )} />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting Application...' : 'Submit Application'}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login/doctor" className="underline">
          Log in
        </Link>
      </div>
    </>

    