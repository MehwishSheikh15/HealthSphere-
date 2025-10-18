"use client"

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth, initiateEmailSignUp, initiateEmailSignIn } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    if (role === 'doctor') {
      // For demonstration, we'll create the dummy doctor account here
      // In a real app, you'd have a proper doctor application process.
      initiateEmailSignUp(auth, 'jalal@gmail.com', '123456');
      toast({
        title: "Doctor Account Created",
        description: "The dummy doctor account has been created. You can now log in.",
      });
      router.push('/auth/login');
      return;
    }

    initiateEmailSignUp(auth, email, password);
    // Here you would typically also save the user's role and other details to Firestore.
    // We will add that in a later step.
    toast({
      title: "Signup Successful!",
      description: "Redirecting you to your dashboard...",
    });
    
    router.push('/patient-dashboard');
  };


  return (
    <>
      <form onSubmit={handleSignup} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" placeholder="Jalal Ahmed" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="patient" className="grid grid-cols-2 gap-4" onValueChange={setRole}>
              <div>
                <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                <Label
                  htmlFor="patient"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Patient
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="doctor"
                  id="doctor"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="doctor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Doctor
                </Label>
              </div>
            </RadioGroup>
        </div>
        <Button type="submit" className="w-full">
          Create an account
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Log in
        </Link>
      </div>
    </>
  )
}
