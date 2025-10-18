
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { User, Stethoscope, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const roles = [
  {
    name: 'Patient',
    icon: User,
    href: '/auth/signup/patient',
    description: 'Create an account to manage your health and book appointments.',
  },
  {
    name: 'Doctor',
    icon: Stethoscope,
    href: '/auth/signup/doctor',
    description: 'Join our network of verified medical professionals.',
  },
];

export default function SignupRoleSelectionPage() {
  const router = useRouter();

  return (
    <>
      <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="grid gap-2 text-center mb-4">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-muted-foreground">Are you a patient or a doctor?</p>
      </div>
      <div className="grid gap-4 w-full">
        {roles.map((role, index) => (
          <Link key={index} href={role.href} passHref>
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <role.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">{role.name}</p>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

       <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Log in
        </Link>
      </div>
    </>
  );
}
