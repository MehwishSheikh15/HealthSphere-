'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data, in a real app this would come from your backend
const doctors = [
  {
    id: "jalal-ahmed",
    name: "Dr. Jalal Ahmed",
    specialization: "Cardiologist",
    rating: 4.8,
    image: PlaceHolderImages.find(p => p.id === 'doctor-1')!,
    location: "Karachi",
    isVerified: true,
    consultationType: "both",
    feePKR: 1500,
    experience: 10,
    qualifications: "MBBS, FCPS (Cardiology)",
    availability: {
      "Monday": ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
      "Wednesday": ["09:00 AM", "10:00 AM", "11:00 AM"],
      "Friday": ["02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
    },
    comments: [
        { user: "Amina", text: "Very knowledgeable and caring." },
        { user: "Bilal", text: "Helped me a lot with my condition." },
    ]
  },
  {
    id: "ayesha-khan",
    name: "Dr. Ayesha Khan",
    specialization: "Dermatologist",
    rating: 4.9,
    image: PlaceHolderImages.find(p => p.id === 'doctor-2')!,
    location: "Lahore",
    isVerified: true,
    consultationType: "online",
    feePKR: 2000,
    experience: 8,
    qualifications: "MBBS, MCPS (Dermatology)",
     availability: {
      "Tuesday": ["10:00 AM", "11:00 AM", "12:00 PM"],
      "Thursday": ["03:00 PM", "04:00 PM", "05:00 PM"],
    },
     comments: [
        { user: "Fatima", text: "Excellent dermatologist! My skin has never been better." },
    ]
  },
  {
    id: "farhan-butt",
    name: "Dr. Farhan Butt",
    specialization: "Pediatrician",
    rating: 4.7,
    image: PlaceHolderImages.find(p => p.id === 'doctor-3')!,
    location: "Islamabad",
    isVerified: true,
    consultationType: "onsite",
    feePKR: 1200,
    experience: 12,
    qualifications: "MBBS, DCH",
     availability: {
      "Monday": ["04:00 PM", "05:00 PM"],
      "Wednesday": ["09:00 AM", "10:00 AM", "11:00 AM"],
      "Saturday": ["10:00 AM", "11:00 AM", "12:00 PM"],
    },
     comments: []
  },
   {
    id: "mehwish-sheikh",
    name: "Dr. Mehwish Sheikh",
    specialization: "Psychologist",
    rating: 5.0,
    image: PlaceHolderImages.find(p => p.id === 'doctor-4')!,
    location: "Karachi",
    isVerified: true,
    consultationType: "online",
    feePKR: 2500,
    experience: 7,
    qualifications: "MSc (Clinical Psychology)",
     availability: {
      "Tuesday": ["06:00 PM", "07:00 PM", "08:00 PM"],
      "Thursday": ["06:00 PM", "07:00 PM", "08:00 PM"],
    },
     comments: [
         { user: "Hassan", text: "A very empathetic listener. Highly recommended." },
     ]
  },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const doctorId = params.id as string;
  
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doctor = doctors.find(d => d.id === doctorId);

  if (!doctor) {
    return <div>Doctor not found.</div>;
  }
  
  const today = new Date();
  const availableDays = daysOfWeek.filter(day => doctor.availability[day as keyof typeof doctor.availability]?.length > 0);

  const handleBookAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDay) {
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "Please select a day and a time slot."
        });
        return;
    }

    setIsSubmitting(true);
    setShowPopup(true);

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        // In a real app, you would navigate after the API call is successful
        router.push('/patient-dashboard/appointments');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSubmitting ? "Sending Request..." : "Request Sent!"}</DialogTitle>
            <DialogDescription>
              {isSubmitting 
                ? "Please wait while we send your appointment request to the doctor."
                : "Your appointment request has been sent. You will be notified once the doctor confirms. Redirecting you to your appointments page."
              }
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Image
                src={doctor.image.imageUrl}
                alt={`Photo of ${doctor.name}`}
                data-ai-hint={doctor.image.imageHint}
                width={400}
                height={400}
                className="aspect-square w-full object-cover rounded-lg"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold font-headline">{doctor.name}</h1>
                    {doctor.isVerified && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Verified</span>
                        </Badge>
                    )}
                </div>
                <p className="text-lg text-muted-foreground">{doctor.specialization}</p>
                <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{doctor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="font-bold text-lg">
                    PKR {doctor.feePKR}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Patient Reviews</h3>
                {doctor.comments.length > 0 ? (
                    <div className="space-y-2">
                        {doctor.comments.map((comment, index) => (
                            <div key={index} className="text-sm bg-gray-50 p-2 rounded-md">
                                <p className="font-bold">{comment.user}</p>
                                <p className="text-muted-foreground">"{comment.text}"</p>
                            </div>
                        ))}
                    </div>
                ): <p className="text-sm text-muted-foreground">No reviews yet.</p>}
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleBookAppointment}>
            <div className="space-y-2">
                <Label>Select Day</Label>
                <div className="flex flex-wrap gap-2">
                    {availableDays.map(day => (
                        <Button
                            key={day}
                            type="button"
                            variant={selectedDay === day ? 'default' : 'outline'}
                            onClick={() => {
                                setSelectedDay(day);
                                setSelectedSlot(null);
                            }}
                        >
                            {day}
                        </Button>
                    ))}
                </div>
            </div>

            {selectedDay && (
                <div className="space-y-2">
                    <Label>Select Time Slot</Label>
                    <div className="flex flex-wrap gap-2">
                        {doctor.availability[selectedDay as keyof typeof doctor.availability].map(slot => (
                        <Button
                            key={slot}
                            type="button"
                            variant={selectedSlot === slot ? 'default' : 'outline'}
                            onClick={() => setSelectedSlot(slot)}
                        >
                            {slot}
                        </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="patient-name">Your Name</Label>
                    <Input id="patient-name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <Input id="patient-phone" type="tel" placeholder="0300-1234567" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="health-condition">Health Issue</Label>
                <Textarea id="health-condition" placeholder="Briefly describe your symptoms or reason for visit" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="prescription">Upload Prescription (Optional)</Label>
                <Input id="prescription" type="file" />
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={!selectedSlot || isSubmitting}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Confirm Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
