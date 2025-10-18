
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Bot, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLoginAssistantResponse, type ChatMessage } from "@/ai/flows/login-assistant-flow";


function AiAgentChat() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm the HealthSphere AI Assistant. How can I help you with logging in, signing up, or understanding our features?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMessage: ChatMessage = { role: 'user', content: chatInput };
    const newHistory = [...chatHistory, newUserMessage];
    setChatHistory(newHistory);
    setChatInput("");
    setLoading(true);

    try {
      const result = await getLoginAssistantResponse({ chatHistory: newHistory });
      const newModelMessage: ChatMessage = { role: 'model', content: result.response };
      setChatHistory([...newHistory, newModelMessage]);
    } catch (error) {
      console.error("AI Assistant chat failed:", error);
      toast({ variant: 'destructive', title: "Chat Failed", description: "The AI is unable to respond right now." });
      const errorMessage: ChatMessage = { role: 'model', content: "I'm sorry, I can't respond at the moment." };
      setChatHistory([...newHistory, errorMessage]);
    }
    setLoading(false);
  };

  return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Bot /> AI Assistant</DialogTitle>
          <DialogDescription>
            Ask me anything about logging in, signing up, or our app features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[50vh]">
            <ScrollArea className="flex-1 p-4 border rounded-md bg-muted/20">
            <div className="space-y-4">
                {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                    <div className="max-w-md p-3 rounded-lg bg-background">
                        <p>Thinking...</p>
                    </div>
                </div>
                )}
            </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
            <Input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask for help..."
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleChat()}
                disabled={loading}
            />
            <Button onClick={handleChat} disabled={loading}>
                <Send className="h-4 w-4" />
            </Button>
            </div>
        </div>
      </DialogContent>
  );
}


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    try {
      // Dummy doctor login
      if (email === "jalal@gmail.com" && password === "123456") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/doctor-dashboard");
        return;
      }
      
      // Dummy admin login
      if (email.includes('admin') && password === '123456') {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/admin-panel');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting you to your dashboard...",
      });
      router.push('/patient-dashboard');
    } catch (error: any) {
        console.error("Login failed: ", error);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid credentials. Please check your email and password and try again."
        });
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full" type="button" onClick={() => toast({ title: "Coming Soon!", description: "Google login will be implemented in a future step." })}>
          Login with Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>

       <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-4">
            <Bot className="mr-2 h-4 w-4" /> Talk to AI Assistant
          </Button>
        </DialogTrigger>
        <AiAgentChat />
      </Dialog>
    </>
  );
}
