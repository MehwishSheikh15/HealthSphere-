import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, HeartPulse, Pill, Salad, Scan, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DoctorCard } from '@/components/shared/doctor-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const aiFeatures = [
  {
    title: 'Medicine Checker',
    description: 'Upload a pill photo to identify medication instantly.',
    icon: <Pill className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Skin Analyzer',
    description: 'Get a confidence-rated diagnosis of skin conditions.',
    icon: <Scan className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Nutritionist',
    description: 'Receive personalized meal plans for your health goals.',
    icon: <Salad className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Psychologist Chat',
    description: 'Access mental health support through our ethical AI.',
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
  },
  {
    title: 'First Aid Agent',
    description: 'Step-by-step guidance for emergency situations.',
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Report Explainer',
    description: 'Understand complex lab reports with simplified summaries.',
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
];

const doctors = [
  {
    name: "Dr. Jalal Ahmed",
    specialization: "Cardiologist",
    rating: 4.8,
    image: PlaceHolderImages[1],
  },
  {
    name: "Dr. Ayesha Khan",
    specialization: "Dermatologist",
    rating: 4.9,
    image: PlaceHolderImages[2],
  },
  {
    name: "Dr. Farhan Butt",
    specialization: "Pediatrician",
    rating: 4.7,
    image: PlaceHolderImages[3],
  },
   {
    name: "Dr. Mehwish Sheikh",
    specialization: "Psychologist",
    rating: 5.0,
    image: PlaceHolderImages[4],
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Intelligent Healthcare, Instantly
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    HealthSphere connects you with top doctors and provides AI-powered tools to manage your health with confidence.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/auth/signup">
                      Join as a Patient <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/auth/signup">
                      Apply as a Doctor
                    </Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={600}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">AI-Powered Services</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Your Personal Health Assistant</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From identifying medications to explaining lab results, our suite of AI tools is designed to empower your health journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
              {aiFeatures.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="doctors" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Find Your Doctor</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with our network of verified, top-rated medical professionals across various specializations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {doctors.map((doctor, index) => (
                <DoctorCard key={index} {...doctor} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button asChild>
                  <Link href="#">
                      View All Doctors
                  </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Take Control of Your Health?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up today and experience a new standard of healthcare.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg" className="w-full">
                  <Link href="/auth/signup">
                    Get Started Now
                  </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
