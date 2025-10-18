
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore } from "@/firebase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";

export default function DoctorLoginPage() {
  const [email, setEmail] = useState("jalal@gmail.com");
  const [password, setPassword] = useState("Jalal.12");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsLoading(true);

    try {
      // First, try to sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting you to your dashboard...",
      });
      router.push('/doctor-dashboard');
    } catch (error: any) {
        // If login fails because the user doesn't exist (for our special test user), create the account
        if (email === "jalal@gmail.com" && (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found')) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const doctorId = 'jalal-ahmed';

                // Update Auth profile
                await updateProfile(user, { displayName: `Dr. Jalal Ahmed` });

                // Create the doctor document in 'doctors' collection with a specific ID
                const doctorDocRef = doc(firestore, "doctors", doctorId);
                await setDoc(doctorDocRef, {
                    id: doctorId,
                    uid: user.uid, // Keep track of the auth UID
                    name: `Dr. Jalal Ahmed`,
                    email: email,
                    role: "doctor",
                    isVerified: true, // This special user is pre-verified
                    verificationStatus: 'Verified',
                    createdAt: new Date().toISOString(),
                    specialization: 'Cardiology',
                    experience: 10,
                });
                
                // Create the user document in 'users' collection for role-based access
                const userDocRef = doc(firestore, "users", user.uid);
                await setDoc(userDocRef, {
                    id: user.uid,
                    name: `Dr. Jalal Ahmed`,
                    email: email,
                    role: "doctor",
                    createdAt: new Date().toISOString(),
                });
                
                toast({
                    title: "Test Account Created & Logged In",
                    description: "Redirecting you to your dashboard...",
                });
                router.push('/doctor-dashboard');

            } catch (creationError: any) {
                 toast({
                    variant: "destructive",
                    title: "Setup Failed",
                    description: "Could not create the test doctor account. Please try again."
                });
            }
        } else {
            // Handle other login errors for regular users
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid credentials. Please check your email and password and try again."
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <form onSubmit={handleLogin} className="grid gap-4">
        <div className="grid gap-2 text-center mb-4">
             <h2 className="text-2xl font-bold">Doctor Login</h2>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="doctor@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
         <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup/doctor" className="underline">
            Sign up
            </Link>
        </div>
      </form>
    </>
  );
}
