import { useState, useRef, useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { getRecommendations } from "../utils/recommendation";
import { INTERNSHIPS } from "../data/internships";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string | React.ReactNode;
  timestamp: Date;
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: `Hello ${user?.name?.split(" ")[0]}! I'm your AI career assistant. How can I help you today? You can ask me about internships, skills, resume tips, or interview prep.`,
      timestamp: new Date()
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (query: string): React.ReactNode => {
    const q = query.toLowerCase();
    
    if (q.includes("internship") || q.includes("इंटर्नशिप") || q.includes("recommend")) {
      const recs = getRecommendations(INTERNSHIPS, user?.skills || []).slice(0, 3);
      return (
        <div>
          <p className="mb-2">Here are my top 3 recommendations for you based on your profile:</p>
          <div className="space-y-2 mt-2">
            {recs.map(r => (
              <div key={r.id} className="p-3 bg-background rounded-lg border border-border text-sm">
                <div className="font-semibold text-primary">{r.title} at {r.company}</div>
                <div className="text-muted-foreground">{r.matchPercent}% match • {r.location}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (q.includes("skill") || q.includes("स्किल्स")) {
      if (user?.skills && user.skills.length > 0) {
        return `You currently have ${user.skills.length} skills listed: ${user.skills.join(", ")}. Consider learning React or Python to broaden your matches!`;
      }
      return "You haven't added any skills to your profile yet! Go to the Profile tab to add some, or use the Resume Analyzer.";
    }
    
    if (q.includes("apply") || q.includes("how to")) {
      return "To apply for an internship, go to the Dashboard, find a role you like, and click the 'Apply Now' button. It will be added to your Applications tab where you can track its status!";
    }
    
    if (q.includes("resume") || q.includes("cv")) {
      return "For a great resume: 1) Keep it to one page, 2) Use action verbs (Built, Led, Designed), 3) Quantify your impact (e.g. 'Improved speed by 20%'), and 4) Highlight your projects clearly with links to GitHub.";
    }
    
    if (q.includes("interview") || q.includes("prep")) {
      return "Interview tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions. For technical interviews, clarify the problem before coding and think out loud. You can practice in our 'Mock Interview' tab!";
    }
    
    if (q.includes("hello") || q.includes("hi") || q.includes("नमस्ते") || q.includes("hey")) {
      return "Hi there! I'm ready to help you land your dream internship. What do you need help with?";
    }
    
    return "I'm not quite sure about that. Try asking for 'internship recommendations', 'resume tips', 'skills', or 'interview prep'!";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: generateResponse(userMsg.content as string),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400); // 600-1000ms delay
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto flex flex-col pt-2 md:pt-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> AI Assistant
          </h1>
          <p className="text-muted-foreground text-sm">Ask me anything about your career journey.</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-md">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <Avatar className={`h-8 w-8 mt-1 border ${msg.role === 'user' ? 'border-primary/20' : 'border-border bg-primary/10'}`}>
                    {msg.role === 'user' ? (
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs"><UserIcon className="h-4 w-4" /></AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-transparent text-primary"><Bot className="h-5 w-5" /></AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted rounded-tl-sm text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1.5 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <Avatar className="h-8 w-8 mt-1 border border-border bg-primary/10">
                    <AvatarFallback className="bg-transparent text-primary"><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-16">
                    <div className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <CardFooter className="p-3 border-t bg-card">
            <form onSubmit={handleSend} className="flex w-full items-center gap-2">
              <Input 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-muted/50 border-border/50 focus-visible:ring-primary/20 h-11 rounded-full px-4"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-11 w-11 rounded-full shrink-0 shadow-sm">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="cursor-pointer hover:bg-muted py-1.5 px-3 rounded-full text-xs font-medium border-border" onClick={() => setInput("Recommend some internships")}>✨ Recommend internships</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted py-1.5 px-3 rounded-full text-xs font-medium border-border" onClick={() => setInput("Give me resume tips")}>📝 Resume tips</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted py-1.5 px-3 rounded-full text-xs font-medium border-border" onClick={() => setInput("How to prepare for interviews?")}>🎯 Interview prep</Badge>
        </div>
      </div>
    </AppLayout>
  );
}
