import { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MonitorPlay, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Brain, AlertCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Explain a complex project you've worked on recently.",
  "Why do you want this internship?",
  "Describe a challenge you overcame in a team setting.",
  "Where do you see yourself in 5 years?",
  "What is Object-Oriented Programming (OOP)?",
  "Explain what a REST API is and how it works.",
  "How do you handle tight deadlines?",
  "Do you have any questions for us?"
];

export default function MockInterviewPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(""));
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentQIndex < 9) {
      setCurrentQIndex(curr => curr + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(curr => curr - 1);
    }
  };

  const handleRetake = () => {
    setIsStarted(false);
    setCurrentQIndex(0);
    setAnswers(Array(10).fill(""));
    setIsFinished(false);
  };

  // Fake scoring logic based on answer length
  const calculateScore = () => {
    let score = 0;
    let strengths: string[] = [];
    let suggestions: string[] = [];

    answers.forEach(answer => {
      const words = answer.trim().split(/\s+/).length;
      if (words > 40) score += 10;
      else if (words > 20) score += 7;
      else if (words > 5) score += 3;
    });

    if (score >= 80) {
      strengths.push("Excellent detail and depth in your responses.");
      strengths.push("Good balance of technical and behavioral articulation.");
      suggestions.push("Ensure you're keeping answers concise while maintaining detail.");
    } else if (score >= 50) {
      strengths.push("Good foundation in your answers.");
      suggestions.push("Try to elaborate more on your project experiences.");
      suggestions.push("Use the STAR method for behavioral questions to add structure.");
    } else {
      strengths.push("You've identified the core concepts.");
      suggestions.push("Your answers are too brief. Aim for 30-50 words per response.");
      suggestions.push("Add specific examples to back up your claims.");
    }

    return { score, strengths, suggestions };
  };

  const renderStartScreen = () => (
    <Card className="max-w-2xl mx-auto border-border/50 shadow-lg text-center p-6">
      <div className="flex justify-center mb-6">
        <div className="bg-primary/10 p-4 rounded-full">
          <MonitorPlay className="h-12 w-12 text-primary" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold mb-3">AI Mock Interview</CardTitle>
      <CardDescription className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
        Practice your interview skills with 10 common behavioral and technical questions. 
        Take your time to type out full, thoughtful answers.
      </CardDescription>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left max-w-lg mx-auto">
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <div className="font-semibold mb-1 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Structure</div>
          <p className="text-xs text-muted-foreground">Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <div className="font-semibold mb-1 flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Detail</div>
          <p className="text-xs text-muted-foreground">Provide specific examples rather than general statements.</p>
        </div>
      </div>
      <Button size="lg" onClick={() => setIsStarted(true)} className="px-8 shadow-md hover-elevate">
        Start Interview
      </Button>
    </Card>
  );

  const renderInterviewScreen = () => (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-2 text-muted-foreground">
          <span>Question {currentQIndex + 1} of 10</span>
          <span>{Math.round(((currentQIndex) / 10) * 100)}% Complete</span>
        </div>
        <Progress value={((currentQIndex) / 10) * 100} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-4">
              <Badge className="w-fit mb-3 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {currentQIndex >= 6 ? "Technical" : "Behavioral"}
              </Badge>
              <CardTitle className="text-xl sm:text-2xl leading-snug">
                {QUESTIONS[currentQIndex]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Type your detailed answer here..."
                className="min-h-[200px] resize-none text-base p-4 bg-muted/30 focus-visible:ring-primary/20"
                value={answers[currentQIndex]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentQIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
                autoFocus
              />
              <div className="flex justify-end mt-2">
                <span className={`text-xs ${answers[currentQIndex].trim().split(/\s+/).filter(w => w).length < 20 ? 'text-amber-500' : 'text-green-500'}`}>
                  {answers[currentQIndex].trim().split(/\s+/).filter(w => w).length} words
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-muted/20 p-4 border-t border-border/50">
              <Button variant="outline" onClick={handlePrev} disabled={currentQIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext} className="shadow-sm">
                {currentQIndex === 9 ? "Finish & Get Feedback" : "Next Question"} 
                {currentQIndex !== 9 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderResultsScreen = () => {
    const { score, strengths, suggestions } = calculateScore();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Interview Complete</h2>
          <p className="text-muted-foreground mt-2">Here's your AI-generated feedback based on your responses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1 border-border/50 shadow-md bg-gradient-to-b from-card to-muted/20 flex flex-col items-center justify-center py-8">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" strokeWidth="3"
                />
                <path
                  className={`${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'} stroke-current`}
                  strokeDasharray={`${score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" strokeWidth="3" strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-3xl font-bold">{score}</div>
            </div>
            <h3 className="font-semibold text-lg">Overall Score</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center px-4">
              {score >= 80 ? "Excellent work! You're ready." : score >= 50 ? "Good job, but room for improvement." : "Needs more practice."}
            </p>
          </Card>

          <div className="md:col-span-2 space-y-4">
            <Card className="border-green-500/20 shadow-sm overflow-hidden">
              <div className="bg-green-500/10 px-4 py-3 flex items-center gap-2 border-b border-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-700 dark:text-green-400">Strengths</h3>
              </div>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-green-500 font-bold">•</span> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 shadow-sm overflow-hidden">
              <div className="bg-amber-500/10 px-4 py-3 flex items-center gap-2 border-b border-amber-500/10">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-700 dark:text-amber-400">Areas for Improvement</h3>
              </div>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-amber-500 font-bold">•</span> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleRetake} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Practice Again
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-8rem)] justify-center py-8">
        {!isStarted ? renderStartScreen() : isFinished ? renderResultsScreen() : renderInterviewScreen()}
      </div>
    </AppLayout>
  );
}
