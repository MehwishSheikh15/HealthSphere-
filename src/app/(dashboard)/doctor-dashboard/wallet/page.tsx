import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorWalletPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Your Wallet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Earnings & Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will display your total earnings, wallet balance, and a history of all your transactions from patient fees.</p>
        </CardContent>
      </Card>
    </div>
  );
}
