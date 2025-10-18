"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, initiateEmailSignIn } from "@/firebase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    // Dummy doctor login
    if (email === "jalal@gmail.com" && password === "123456") {
      initiateEmailSignIn(auth, email, password);
      router.push("/doctor-dashboard");
      return;
    }
    
    // Dummy admin login
    if (email.includes('admin') && password === '123456') {
      initiateEmailSignIn(auth, email, password);
      router.push('/admin-panel');
      return;
    }

    initiateEmailSignIn(auth, email, password);
    toast({
      title: "Login Initiated",
      description: "Redirecting you to your dashboard...",
    });
    // The useUser hook in the layout will handle redirection
    router.push('/patient-dashboard');
  };

  return (
    <>
      <form onSubmit={handleLogin} className="grid gap-4">
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
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full" type="button" onClick={() => toast({ title: "Coming Soon!", description: "Google login will be implemented in a future step." })}>
          Login with Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
