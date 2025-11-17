import Image from 'next/image';
import { Star, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import Link from 'next/link';

type DoctorCardProps = {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  image: ImagePlaceholder;
  isVerified: boolean;
  feePKR: number;
};

export function DoctorCard({ id, name, specialization, rating, image, isVerified, feePKR }: DoctorCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl flex flex-col">
      <CardContent className="p-0 flex-grow">
        <div className="relative">
          <Image
            src={image.imageUrl}
            alt={`Photo of ${name}`}
            data-ai-hint={image.imageHint}
            width={300}
            height={300}
            className="aspect-square w-full object-cover"
          />
           {isVerified && (
            <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1 bg-green-100 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Verified</span>
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold font-headline">{name}</h3>
          <p className="text-sm text-muted-foreground">{specialization}</p>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{rating}</span>
            </Badge>
            <p className="text-sm font-semibold">PKR {feePKR}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Button asChild className="w-full">
            <Link href={`/patient-dashboard/find-a-doctor/${id}`}>Book Appointment</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}


