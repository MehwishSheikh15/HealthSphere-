'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    cta: 'Current Plan',
    isCurrent: true,
  },
  {
    name: 'Pro',
    price: 'PKR 1000',
    period: '/month',
    description: 'Unlock the full power of HealthSphere.',
    features: [
      'Everything in Free, plus:',
      'Unlimited appointments',
      'Advanced AI diagnostics',
      'Priority support & video call features',
      'Comprehensive health reports',
    ],
    cta: 'Upgrade to Pro',
    isCurrent: false,
    featured: true,
  },
];

export default function PatientSubscriptionsPage() {
  const { toast } = useToast();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // In a real app, this would come from the user's profile in Firestore
  const [currentPlan, setCurrentPlan] = useState('Free');

  const handleUpgradeClick = () => {
    // This is where you would initiate the Stripe checkout session
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    toast({ title: 'Processing payment...' });

    setTimeout(() => {
        setShowPaymentDialog(false);
        setCurrentPlan('Pro');
        toast({
            title: 'Payment Successful!',
            description: 'You have successfully upgraded to the Pro plan.',
        });
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Pro Plan</DialogTitle>
            <DialogDescription>
              Complete your payment to unlock all Pro features. This is a mock payment form for demonstration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input type="text" id="card-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="Jalal Ahmed" />
            </div>
             <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input type="text" id="card-number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="**** **** **** 1234" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="expiry-month" className="block text-sm font-medium text-gray-700">Expiry</label>
                    <input type="text" id="expiry-month" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="MM/YY" />
                </div>
                <div>
                     <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" id="cvc" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="123" />
                </div>
            </div>
             <Button type="submit" className="w-full">
                Pay PKR 1000
             </Button>
          </form>
        </DialogContent>
      </Dialog>


      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Your Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and billing details.</p>
      </header>
       <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {plans.map((plan) => {
                const isCurrentUserPlan = plan.name === currentPlan;
                return (
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
                            {isCurrentUserPlan ? (
                                <Button className="w-full" disabled>Your Current Plan</Button>
                            ) : (
                                <Button onClick={handleUpgradeClick} className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                                {plan.cta}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    </div>
  );
}
