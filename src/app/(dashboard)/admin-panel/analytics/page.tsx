import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Platform Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will contain detailed analytics about platform usage, revenue, user growth, and more.</p>
        </CardContent>
      </Card>
    </div>
  );
}
