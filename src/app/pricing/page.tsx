import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 'PKR 0',
    period: '/month',
    description: 'Get started with our basic features.',
    features: [
      'Access to AI health tools',
      'Book up to 5 appointments per month',
      'Basic medication reminders',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
  },
  {
    name: 'Pro',
    price: 'PKR 1000',
    period: '/month',
    description: 'Unlock the full power of HealthSphere.',
    features: [
      'Unlimited appointments',
      'Advanced AI diagnostics',
      'Priority support',
      'Comprehensive health reports',
    ],
    cta: 'Upgrade to Pro',
    href: '/auth/signup',
    featured: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          {/* ⭐ Back to Home Button Added Here */}
          <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                Choose Your Plan
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple, transparent pricing for everyone.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.featured ? 'border-primary shadow-lg' : ''}>
                <CardHeader className="pb-4">
                  <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tighter">{plan.price}</span>
                    <span className="ml-1 text-sm font-medium text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
