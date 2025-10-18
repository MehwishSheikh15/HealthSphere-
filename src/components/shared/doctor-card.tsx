import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type DoctorCardProps = {
  name: string;
  specialization: string;
  rating: number;
  image: ImagePlaceholder;
};

export function DoctorCard({ name, specialization, rating, image }: DoctorCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={image.imageUrl}
            alt={`Photo of ${name}`}
            data-ai-hint={image.imageHint}
            width={300}
            height={300}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold font-headline">{name}</h3>
          <p className="text-sm text-muted-foreground">{specialization}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{rating}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
