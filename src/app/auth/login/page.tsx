
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { User, Stethoscope, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const roles = [
  {
    name: 'Patient',
    icon: User,
    href: '/auth/login/patient',
    description: 'Access your health records, appointments, and AI tools.',
  },
  {
    name: 'Doctor',
    icon: Stethoscope,
    href: '/auth/login/doctor',
    description: 'Manage your practice, patient requests, and schedule.',
  },
  {
    name: 'Admin',
    icon: Shield,
    href: '/auth/login/admin',
    description: 'Access the admin panel to manage the platform.',
  }
];

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <>
      <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.push('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Home
      </Button>
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
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
