'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, HeartPulse, Pill, Salad, Scan, FileText, Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DoctorCard } from '@/components/shared/doctor-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { getLoginAssistantResponse, type ChatMessage } from "@/ai/flows/login-assistant-flow";
import { useToast } from "@/hooks/use-toast";

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
    id: "jalal-ahmed",
    name: "Dr. Jalal Ahmed",
    specialization: "Cardiologist",
    rating: 4.8,
    image: PlaceHolderImages.find(p => p.id === 'doctor-1')!,
    isVerified: true,
    feePKR: 1500,
  },
  {
    id: "ayesha-khan",
    name: "Dr. Ayesha Khan",
    specialization: "Dermatologist",
    rating: 4.9,
    image: PlaceHolderImages.find(p => p.id === 'doctor-2')!,
    isVerified: true,
    feePKR: 2000,
  },
  {
    id: "farhan-butt",
    name: "Dr. Farhan Butt",
    specialization: "Pediatrician",
    rating: 4.7,
    image: PlaceHolderImages.find(p => p.id === 'doctor-3')!,
    isVerified: true,
    feePKR: 1200,
  },
   {
    id: "mehwish-sheikh",
    name: "Dr. Mehwish Sheikh",
    specialization: "Psychologist",
    rating: 5.0,
    image: PlaceHolderImages.find(p => p.id === 'doctor-4')!,
    isVerified: true,
    feePKR: 2500,
  },
];

function AiAgentChat() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm the HealthSphere AI Assistant. How can I help you learn about our features or get you started with signing up?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMessage: ChatMessage = { role: 'user', content: chatInput };
    const newHistory = [...chatHistory, newUserMessage];
    setChatHistory(newHistory);
    setChatInput("");
    setLoading(true);

    try {
      const result = await getLoginAssistantResponse({ chatHistory: newHistory });
      const newModelMessage: ChatMessage = { role: 'model', content: result.response };
      setChatHistory([...newHistory, newModelMessage]);
    } catch (error) {
      console.error("AI Assistant chat failed:", error);
      toast({ variant: 'destructive', title: "Chat Failed", description: "The AI is unable to respond right now." });
      const errorMessage: ChatMessage = { role: 'model', content: "I'm sorry, I can't respond at the moment." };
      setChatHistory([...newHistory, errorMessage]);
    }
    setLoading(false);
  };

  return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Bot /> AI Assistant</DialogTitle>
          <DialogDescription>
            Ask me anything about HealthSphere's features, pricing, or how to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[50vh]">
            <ScrollArea className="flex-1 p-4 border rounded-md bg-muted/20">
            <div className="space-y-4">
                {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                    <div className="max-w-md p-3 rounded-lg bg-background">
                        <p>Thinking...</p>
                    </div>
                </div>
                )}
            </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
            <Input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleChat()}
                disabled={loading}
            />
            <Button onClick={handleChat} disabled={loading}>
                <Send className="h-4 w-4" />
            </Button>
            </div>
        </div>
      </DialogContent>
  );
}


export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  const healthQuotes = [
    "The greatest wealth is health.",
    "A healthy outside starts from the inside.",
    "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    "He who has health has hope; and he who has hope, has everything."
  ];

  const randomQuote = healthQuotes[Math.floor(Math.random() * healthQuotes.length)];


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
        
        {/* <section id="doctors" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
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
                  <Link href="/auth/signup">
                      View All Doctors
                  </Link>
              </Button>
            </div>
          </div>
        </section> */}

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

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <Bot className="h-6 w-6" />
            <span className="sr-only">Open AI Assistant</span>
          </Button>
        </DialogTrigger>
        <AiAgentChat />
      </Dialog>
    </div>
  );
}
