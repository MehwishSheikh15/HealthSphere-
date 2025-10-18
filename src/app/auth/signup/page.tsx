"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SignupPage() {
  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" placeholder="Jalal Ahmed" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="patient" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                <Label
                  htmlFor="patient"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Patient
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="doctor"
                  id="doctor"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="doctor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Doctor
                </Label>
              </div>
            </RadioGroup>
        </div>
        <Button type="submit" className="w-full">
          Create an account
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Log in
        </Link>
      </div>
    </>
  )
}
