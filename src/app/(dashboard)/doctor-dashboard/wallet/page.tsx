'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Transaction } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Wallet as WalletIcon } from "lucide-react";


const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    appointmentId: 'appt_1',
    patientId: 'patient_1',
    patientName: 'Amina Sheikh',
    doctorId: 'jalal-ahmed',
    amountPKR: 1500,
    commission: 150,
    doctorEarning: 1350,
    status: 'Paid',
    createdAt: new Date('2024-05-20T10:00:00Z').toISOString(),
  },
  {
    id: 'txn_2',
    appointmentId: 'appt_2',
    patientId: 'patient_2',
    patientName: 'Bilal Khan',
    doctorId: 'jalal-ahmed',
    amountPKR: 1500,
    commission: 150,
    doctorEarning: 1350,
    status: 'Paid',
    createdAt: new Date('2024-05-18T14:30:00Z').toISOString(),
  },
  {
    id: 'txn_3',
    appointmentId: 'appt_3',
    patientId: 'patient_3',
    patientName: 'Fatima Ali',
    doctorId: 'jalal-ahmed',
    amountPKR: 1500,
    commission: 150,
    doctorEarning: 1350,
    status: 'Paid',
    createdAt: new Date('2024-05-15T09:00:00Z').toISOString(),
  },
];


function TransactionSkeleton() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></TableCell>
        </TableRow>
    );
}

export default function DoctorWalletPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    // For now, we use mock data for the special test doctor
    if (user.email === 'jalal@gmail.com') return null;

    return query(collection(firestore, 'transactions'), where('doctorId', '==', user.uid));
  }, [user, firestore]);

  const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

  const isTestUser = user?.email === 'jalal@gmail.com';
  const finalTransactions = isTestUser ? mockTransactions : transactions;

  const showLoading = isLoading || isUserLoading;

  const totalEarnings = finalTransactions?.reduce((acc, txn) => acc + txn.doctorEarning, 0) || 0;
  // This would be a separate field in a real wallet doc
  const walletBalance = totalEarnings - 5000 > 0 ? totalEarnings - 5000 : 12350; 

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Wallet</h1>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {showLoading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">PKR {walletBalance.toLocaleString()}</div>}
             <p className="text-xs text-muted-foreground">Available for withdrawal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (All Time)</CardTitle>
             <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {showLoading ? <Skeleton className="h-8 w-36" /> : <div className="text-2xl font-bold">PKR {totalEarnings.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">From all completed appointments</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
           <CardDescription>A record of all earnings from your appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="text-right">Fee Paid (PKR)</TableHead>
                <TableHead className="text-right">Commission (PKR)</TableHead>
                <TableHead className="text-right">Your Earning (PKR)</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showLoading ? (
                <>
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                </>
              ) : finalTransactions && finalTransactions.length > 0 ? (
                finalTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{txn.patientName}</TableCell>
                    <TableCell className="text-right">{txn.amountPKR.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-destructive">-{txn.commission.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">+{txn.doctorEarning.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={txn.status === 'Paid' ? 'default' : 'secondary'}>{txn.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
