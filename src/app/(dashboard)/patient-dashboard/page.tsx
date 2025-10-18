'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BrainCircuit,
  Calendar,
  FileText,
  Bell,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function PatientDashboardPage() {
  const { user } = useUser();

  const features = [
    {
      title: 'AI Assistant',
      description: 'Ask questions and get information about HealthSphere.',
      href: '/patient-dashboard/ai-tools',
      icon: BrainCircuit,
    },
    {
      title: 'Appointments',
      description: 'Manage your upcoming and past appointments.',
      href: '/patient-dashboard/appointments',
      icon: Calendar,
    },
    {
      title: 'Reminders',
      description: 'View and manage your health and medicine reminders.',
      href: '/patient-dashboard/reminders',
      icon: Bell,
    },
    {
      title: 'Find a Doctor',
      description: 'Browse and connect with qualified doctors near you.',
      href: '#', 
      icon: Stethoscope,
    },
    {
      title: 'Subscription',
      description: 'View and manage your subscription plan.',
      href: '/patient-dashboard/subscriptions',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <header>
        <h1 className="font-headline text-3xl font-bold">
          Welcome, {user?.displayName || 'Patient'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of your HealthSphere account.
        </p>
      </header>

      {/* Feature Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                {feature.title}
              </CardTitle>
              <feature.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {feature.description}
              </p>

              <Link
                href={feature.href}
                passHref
              >
                <Button variant="link" className="px-0 text-primary">
                  Go to {feature.title}{' '}
                  <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
         <Card
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Pay Doctor's Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Pay for your recent consultations.
              </p>

              <Button variant="link" className="px-0 text-primary">
                  Make Payment{' '}
                  <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
