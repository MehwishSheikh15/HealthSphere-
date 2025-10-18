'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DoctorCard } from '@/components/shared/doctor-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Search, MapPin, Video } from 'lucide-react';
import Link from 'next/link';

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
  },
];

const specializations = ["Cardiologist", "Dermatologist", "Pediatrician", "Psychologist", "General Physician"];
const locations = ["Karachi", "Lahore", "Islamabad", "All"];
const consultationTypes = ["online", "onsite", "both"];


export default function FindDoctorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [location, setLocation] = useState('all');
  const [consultationType, setConsultationType] = useState('all');

  const filteredDoctors = doctors.filter(doctor => {
    const matchesQuery = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = specialization === 'all' || doctor.specialization === specialization;
    const matchesLocation = location === 'all' || doctor.location === location;
    const matchesConsultationType = consultationType === 'all' || doctor.consultationType === consultationType || doctor.consultationType === 'both';
    return matchesQuery && matchesSpecialization && matchesLocation && matchesConsultationType;
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Find Your Doctor</h1>
        <p className="text-muted-foreground">Search for verified doctors by name, specialty, or location.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by doctor name or specialization..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={specialization} onValueChange={setSpecialization}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Specializations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map(spec => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-[200px]">
             <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Locations</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={consultationType} onValueChange={setConsultationType}>
          <SelectTrigger className="w-full md:w-[200px]">
             <Video className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Consultation Type" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Types</SelectItem>
             <SelectItem value="online">Online</SelectItem>
             <SelectItem value="onsite">On-site</SelectItem>
             <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <DoctorCard key={index} {...doctor} />
        ))}
      </div>
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
