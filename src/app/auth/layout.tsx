
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const bgImage = PlaceHolderImages.find(p => p.id === 'auth-background');

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
       <div className="relative flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="mx-auto mb-4">
                <Logo className="size-12" />
            </Link>
            <h1 className="text-3xl font-bold font-headline">Welcome to HealthSphere</h1>
            <p className="text-balance text-muted-foreground">
              Your trusted partner in health.
            </p>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                data-ai-hint={bgImage.imageHint}
                fill
                className="object-cover"
            />
        )}
      </div>
    </div>
  );
}
