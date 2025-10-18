'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import type { Reminder } from '@/lib/types';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { PlusCircle, Trash, Edit, Bell, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function ReminderForm({ reminder, onSave, onOpenChange }: { reminder?: Reminder, onSave: (data: any) => void, onOpenChange: (open: boolean) => void }) {
    const [title, setTitle] = useState(reminder?.title || '');
    const [dosage, setDosage] = useState(reminder?.message || '');
    const [time, setTime] = useState(reminder?.time ? reminder.time.substring(0, 16) : '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, message: dosage, time: new Date(time).toISOString(), type: 'medication' });
        onOpenChange(false);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="med-name">Medicine Name</Label>
                <Input id="med-name" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Panadol" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input id="med-dosage" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g., 2 tablets" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="med-time">Time</Label>
                <Input id="med-time" type="datetime-local" value={time} onChange={e => setTime(e.target.value)} required />
            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Reminder</Button>
            </DialogFooter>
        </form>
    );
}

function ReminderCard({ reminder, onEdit, onDelete }: { reminder: Reminder, onEdit: () => void, onDelete: () => void }) {
    const isMedication = reminder.type === 'medication';
    return (
        <Card>
            <CardHeader className='flex-row items-start gap-4 space-y-0'>
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    {isMedication ? <Pill className="h-6 w-6 text-primary" /> : <Bell className="h-6 w-6 text-primary" />}
                </div>
                <div>
                    <CardTitle>{reminder.title}</CardTitle>
                    <CardDescription>{reminder.message}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="font-semibold">
                    {new Date(reminder.time).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="ghost" size="icon" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" onClick={onDelete}><Trash className="h-4 w-4" /></Button>
            </CardFooter>
        </Card>
    );
}

function ReminderSkeleton() {
    return (
        <Card>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-5 w-40" />
            </CardContent>
             <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
            </CardFooter>
        </Card>
    );
}

export default function PatientRemindersPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);

    const remindersQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'reminders'), where('userId', '==', user.uid));
    }, [user, firestore]);

    const { data: reminders, isLoading } = useCollection<Reminder>(remindersQuery);
    
    const medicationReminders = reminders?.filter(r => r.type === 'medication') ?? [];
    const appointmentReminders = reminders?.filter(r => r.type === 'appointment') ?? [];

    const handleSave = async (data: Partial<Reminder>) => {
        if (!user || !firestore) return;

        try {
             if (editingReminder) { // Update existing reminder
                const reminderRef = doc(firestore, 'reminders', editingReminder.id);
                updateDocumentNonBlocking(reminderRef, data);
                toast({ title: "Reminder Updated!", description: "Your reminder has been successfully updated." });

            } else { // Create new reminder
                const newReminder = {
                    ...data,
                    userId: user.uid,
                    createdAt: new Date().toISOString(),
                };
                const remindersCol = collection(firestore, 'reminders');
                addDocumentNonBlocking(remindersCol, newReminder);
                toast({ title: "Reminder Set!", description: "Your new reminder has been created." });
            }
            setEditingReminder(undefined);
            setIsFormOpen(false);

        } catch (error) {
            console.error("Error saving reminder: ", error);
            toast({ variant: 'destructive', title: "Save Failed", description: "Could not save your reminder. Please try again." });
        }
    };
    
    const handleDelete = async (reminderId: string) => {
        if (!firestore) return;
        if(confirm('Are you sure you want to delete this reminder?')) {
            const reminderRef = doc(firestore, 'reminders', reminderId);
            deleteDocumentNonBlocking(reminderRef);
            toast({ title: "Reminder Deleted", description: "The reminder has been removed." });
        }
    };

    const openEditDialog = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setIsFormOpen(true);
    };

     const openNewDialog = () => {
        setEditingReminder(undefined);
        setIsFormOpen(true);
    };
    
    const showLoading = isLoading || isUserLoading;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Your Reminders</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Medication Reminder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingReminder ? "Edit Reminder" : "Add a New Medication Reminder"}</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to set up a reminder for your medication.
                    </DialogDescription>
                </DialogHeader>
                <ReminderForm reminder={editingReminder} onSave={handleSave} onOpenChange={setIsFormOpen} />
            </DialogContent>
        </Dialog>
      </div>

       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Appointment Reminders</h2>
         {showLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><ReminderSkeleton /></div>
         ) : appointmentReminders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {appointmentReminders.map(r => (
                  <ReminderCard key={r.id} reminder={r} onEdit={() => openEditDialog(r)} onDelete={() => handleDelete(r.id)} />
              ))}
            </div>
         ) : (
            <Card className="text-center p-8">
                <p className="text-muted-foreground">You have no upcoming appointment reminders.</p>
                <p className="text-sm text-muted-foreground mt-1">Confirmed appointments will appear here automatically.</p>
            </Card>
         )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Medication Reminders</h2>
         {showLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><ReminderSkeleton /><ReminderSkeleton /></div>
         ) : medicationReminders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {medicationReminders.map(r => (
                  <ReminderCard key={r.id} reminder={r} onEdit={() => openEditDialog(r)} onDelete={() => handleDelete(r.id)} />
              ))}
            </div>
         ) : (
            <Card className="text-center p-8">
                <p className="text-muted-foreground">You have not set any medication reminders yet.</p>
                 <Button variant="link" onClick={openNewDialog} className="mt-2">Create your first one</Button>
            </Card>
         )}
      </section>

    </div>
  );
}
