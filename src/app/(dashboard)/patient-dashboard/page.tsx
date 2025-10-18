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
  ShieldQuestion,
  FileScan,
  Pill,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function PatientDashboardPage() {
  const { user } = useUser();

  const features = [
    {
      title: 'AI Health Tools',
      description: 'Use our AI to check skin conditions, identify medicine, and more.',
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
    {
      title: 'Settings',
      description: 'Update your profile and notification settings.',
      href: '/patient-dashboard/settings',
      icon: FileText,
    },
  ];
  
  const healthQuotes = [
    "The greatest wealth is health.",
    "A healthy outside starts from the inside.",
    "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    "He who has health has hope; and he who has hope, has everything."
  ];

  const randomQuote = healthQuotes[Math.floor(Math.random() * healthQuotes.length)];


  return (
    <div className="space-y-6">
      <header className='space-y-4'>
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Welcome, {user?.displayName || 'Patient'}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a quick overview of your HealthSphere account.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Health Tip of the Day</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-muted-foreground'>{randomQuote}</p>
            </CardContent>
        </Card>
      </header>

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
