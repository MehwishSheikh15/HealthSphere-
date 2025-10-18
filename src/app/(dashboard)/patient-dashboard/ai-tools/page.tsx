'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Pill, Scan, Heart, FileScan, Bot } from "lucide-react";
import { analyzeSkinCondition, type AnalyzeSkinConditionOutput } from '@/ai/flows/skin-analysis-flow';
import { checkMedicine, type CheckMedicineOutput } from '@/ai/flows/medicine-check-flow';
import { getFirstAidInstructions, type FirstAidOutput } from '@/ai/flows/first-aid-flow';
import { summarizeLabReport, type SummarizeLabReportOutput } from '@/ai/flows/lab-report-summary-flow';
import { useToast } from "@/hooks/use-toast";

export default function AiToolsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  // State for Skin Analyzer
  const [skinImage, setSkinImage] = useState<File | null>(null);
  const [skinDescription, setSkinDescription] = useState("");
  const [skinResult, setSkinResult] = useState<AnalyzeSkinConditionOutput | null>(null);

  // State for Medicine Checker
  const [medicineImage, setMedicineImage] = useState<File | null>(null);
  const [medicineResult, setMedicineResult] = useState<CheckMedicineOutput | null>(null);

  // State for First Aid
  const [emergencyDescription, setEmergencyDescription] = useState("");
  const [firstAidResult, setFirstAidResult] = useState<FirstAidOutput | null>(null);

  // State for Lab Report Summary
  const [labReport, setLabReport] = useState<File | null>(null);
  const [labReportResult, setLabReportResult] = useState<SummarizeLabReportOutput | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSkinAnalysis = async () => {
    if (!skinImage) {
      toast({ variant: 'destructive', title: "No image selected", description: "Please upload a photo of the skin condition." });
      return;
    }
    setLoading(prev => ({ ...prev, skin: true }));
    setSkinResult(null);
    try {
      const photoDataUri = await fileToDataUri(skinImage);
      const result = await analyzeSkinCondition({ photoDataUri, description: skinDescription });
      setSkinResult(result);
    } catch (error) {
      console.error("Skin analysis failed:", error);
      toast({ variant: 'destructive', title: "Analysis Failed", description: "Could not analyze the skin image. Please try again." });
    }
    setLoading(prev => ({ ...prev, skin: false }));
  };

  const handleMedicineCheck = async () => {
    if (!medicineImage) {
      toast({ variant: 'destructive', title: "No image selected", description: "Please upload a photo of the medicine." });
      return;
    }
    setLoading(prev => ({ ...prev, medicine: true }));
    setMedicineResult(null);
    try {
      const photoDataUri = await fileToDataUri(medicineImage);
      const result = await checkMedicine({ photoDataUri });
      setMedicineResult(result);
    } catch (error) {
      console.error("Medicine check failed:", error);
      toast({ variant: 'destructive', title: "Check Failed", description: "Could not identify the medicine. Please try again." });
    }
    setLoading(prev => ({ ...prev, medicine: false }));
  };

  const handleFirstAid = async () => {
     if (!emergencyDescription) {
      toast({ variant: 'destructive', title: "No description", description: "Please describe the emergency." });
      return;
    }
    setLoading(prev => ({ ...prev, firstAid: true }));
    setFirstAidResult(null);
    try {
      const result = await getFirstAidInstructions({ emergencyDescription });
      setFirstAidResult(result);
    } catch (error) {
      console.error("First aid instruction failed:", error);
      toast({ variant: 'destructive', title: "Failed to get instructions", description: "Could not get first aid instructions. Please try again." });
    }
    setLoading(prev => ({ ...prev, firstAid: false }));
  }

  const handleLabReport = async () => {
    if (!labReport) {
      toast({ variant: 'destructive', title: "No file selected", description: "Please upload your lab report." });
      return;
    }
    setLoading(prev => ({ ...prev, lab: true }));
    setLabReportResult(null);
    try {
      const labReportDataUri = await fileToDataUri(labReport);
      const result = await summarizeLabReport({ labReportDataUri });
      setLabReportResult(result);
    } catch (error) {
      console.error("Lab report summary failed:", error);
      toast({ variant: 'destructive', title: "Summary Failed", description: "Could not summarize the lab report. Please try again." });
    }
    setLoading(prev => ({ ...prev, lab: false }));
  }


  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">AI Health Tools</h1>
      <p className="text-muted-foreground mb-6">Your personal AI-powered health assistant.</p>
      
      <Tabs defaultValue="skin-analyzer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="skin-analyzer"><Scan className="mr-2" />Skin Analyzer</TabsTrigger>
          <TabsTrigger value="medicine-checker"><Pill className="mr-2" />Medicine Checker</TabsTrigger>
          <TabsTrigger value="first-aid"><Heart className="mr-2" />First Aid</TabsTrigger>
          <TabsTrigger value="lab-report"><FileScan className="mr-2" />Lab Report</TabsTrigger>
          <TabsTrigger value="psychologist"><Bot className="mr-2" />Psychologist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skin-analyzer">
          <Card>
            <CardHeader>
              <CardTitle>Skin Condition Analyzer</CardTitle>
              <CardDescription>Upload a photo of a skin condition to get an AI-powered analysis. This is not a medical diagnosis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="skin-picture">Picture</Label>
                <Input id="skin-picture" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSkinImage)} />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="skin-description">Description (Optional)</Label>
                <Textarea placeholder="Describe the condition, symptoms, or duration..." id="skin-description" value={skinDescription} onChange={(e) => setSkinDescription(e.target.value)} />
              </div>
              <Button onClick={handleSkinAnalysis} disabled={loading.skin}>
                {loading.skin ? "Analyzing..." : "Analyze Skin Condition"}
              </Button>
              {skinResult && (
                <Alert>
                  <AlertTitle>Analysis Complete</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p><strong>Condition:</strong> {skinResult.condition}</p>
                    <p><strong>Confidence:</strong> {Math.round(skinResult.confidence * 100)}%</p>
                    <p><strong>Advice:</strong> {skinResult.advice}</p>
                    <p className="text-xs text-red-500 mt-2">Disclaimer: This is an AI-generated analysis and not a substitute for professional medical advice. Please consult a qualified dermatologist.</p>
                     <Button asChild className="mt-4"><Link href="#">Book a Dermatologist</Link></Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicine-checker">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Checker</CardTitle>
              <CardDescription>Upload a photo of a pill to identify it. This tool helps verify medication but always consult a pharmacist or doctor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="medicine-picture">Pill Picture</Label>
                <Input id="medicine-picture" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setMedicineImage)} />
              </div>
              <Button onClick={handleMedicineCheck} disabled={loading.medicine}>
                {loading.medicine ? "Checking..." : "Check Medicine"}
              </Button>
              {medicineResult && (
                 <Alert>
                  <AlertTitle>Identification Result</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p><strong>Is it a medicine?</strong> {medicineResult.identification.isMedicine ? 'Yes' : 'No'}</p>
                    <p><strong>Name:</strong> {medicineResult.identification.name}</p>
                    <p><strong>Confidence:</strong> {Math.round(medicineResult.identification.confidence * 100)}%</p>
                    <p><strong>Description:</strong> {medicineResult.identification.description}</p>
                    <p className="text-xs text-red-500 mt-2">Disclaimer: AI identification can be inaccurate. Always verify with a healthcare professional before taking any medication.</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="first-aid">
          <Card>
            <CardHeader>
              <CardTitle>First Aid Agent</CardTitle>
              <CardDescription>Describe an emergency situation to get step-by-step first aid guidance. For severe emergencies, call 115 immediately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="emergency-description">Emergency Situation</Label>
                <Textarea placeholder="e.g., 'Someone is choking', 'Deep cut on arm with bleeding'" id="emergency-description" value={emergencyDescription} onChange={(e) => setEmergencyDescription(e.target.value)} />
              </div>
              <Button onClick={handleFirstAid} disabled={loading.firstAid}>
                {loading.firstAid ? "Getting Instructions..." : "Get First Aid Steps"}
              </Button>
               {firstAidResult && (
                 <Alert>
                  <AlertTitle>First Aid Instructions</AlertTitle>
                  <AlertDescription className="space-y-2 whitespace-pre-wrap">
                    <p>{firstAidResult.instructions}</p>
                    <div className="flex items-center gap-4 mt-4">
                        <p className="font-bold">For emergencies in Pakistan, call:</p>
                        <Button variant="destructive" asChild><a href="tel:115">Call 115 (Ambulance)</a></Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lab-report">
           <Card>
            <CardHeader>
              <CardTitle>Lab Report Explainer</CardTitle>
              <CardDescription>Upload a lab report (PDF or image) to get a simplified summary of the key findings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="lab-report">Lab Report File</Label>
                <Input id="lab-report" type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, setLabReport)} />
              </div>
              <Button onClick={handleLabReport} disabled={loading.lab}>
                {loading.lab ? "Summarizing..." : "Explain Report"}
              </Button>
              {labReportResult && (
                 <Alert>
                  <AlertTitle>Lab Report Summary</AlertTitle>
                  <AlertDescription className="space-y-2 whitespace-pre-wrap">
                    <p>{labReportResult.summary}</p>
                    <p className="text-xs text-red-500 mt-2">This is a simplified summary and not a diagnosis. Discuss the full report with your doctor.</p>
                    <Button asChild className="mt-4"><Link href="#">Consult a Doctor</Link></Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="psychologist">
           <Card>
            <CardHeader>
              <CardTitle>AI Psychologist Chat</CardTitle>
              <CardDescription>Access mental health support through our ethical AI, guided by Islamic principles. This is not a replacement for professional therapy.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                  <BrainCircuit className="h-4 w-4" />
                  <AlertTitle>Coming Soon!</AlertTitle>
                  <AlertDescription>
                    Our ethical AI Psychologist, incorporating guidance from the Qur'an and Sunnah, is under development to ensure it is both helpful and responsible.
                  </AlertDescription>
                </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
