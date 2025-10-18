import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiToolsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">AI Health Tools</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Personal Health Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will provide access to all the AI-powered tools, such as the Medicine Checker, Skin Analyzer, Nutritionist, and more.</p>
        </CardContent>
      </Card>
    </div>
  );
}
