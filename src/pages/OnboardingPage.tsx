import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUp, Sparkles, ArrowRight, X, User as UserIcon, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { analyzeResume, ResumeAnalysisResult } from "../utils/resumeAnalyzer";
import { useToast } from "@/hooks/use-toast";
import { SkillTag } from "../components/common/SkillTag";

const ROLES = [
  "Frontend Dev", "Backend Dev", "Full Stack Dev", "Data Science", 
  "ML/AI", "DevOps", "UI/UX Design", "Product Management", "Marketing", "Other"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Master's"];

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    college: "",
    year: "",
    preferredRole: "",
    phone: ""
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFilename(e.target.files[0].name);
    }
  };

  const handleAnalyzeResume = () => {
    if (!resumeFilename) return;
    
    setIsAnalyzing(true);
    
    // Fake loading delay
    setTimeout(() => {
      const result = analyzeResume(resumeFilename, skills);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      toast({ description: "Resume analyzed!" });
    }, 1500);
  };

  const handleMergeSkills = () => {
    if (!analysisResult) return;
    
    const newSkills = [...new Set([...skills, ...analysisResult.skillsFound])];
    setSkills(newSkills);
    toast({ description: "Skills updated from resume" });
  };

  const handleComplete = () => {
    if (!user) return;
    
    updateUser({
      ...user,
      ...formData,
      skills,
      resumeFilename: resumeFilename || undefined
    });
    
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help our AI find the perfect internships for you</p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 px-4">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
        
        <Card className="border-border/50 shadow-xl overflow-hidden">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" /> Basic Information
                </CardTitle>
                <CardDescription>Tell us about your education</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="college">College / University</Label>
                  <Input 
                    id="college" 
                    placeholder="e.g. Stanford University" 
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <Select value={formData.year} onValueChange={(v) => handleInputChange('year', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t p-6 bg-muted/20">
                <Button onClick={() => setStep(2)} disabled={!formData.college || !formData.year}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> Skills & Roles
                </CardTitle>
                <CardDescription>What are you looking for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Preferred Role</Label>
                  <Select value={formData.preferredRole} onValueChange={(v) => handleInputChange('preferredRole', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="skills">Your Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                    {skills.length === 0 && <span className="text-sm text-muted-foreground italic">No skills added yet</span>}
                    {skills.map(skill => (
                      <SkillTag key={skill} skill={skill} onRemove={() => removeSkill(skill)} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="skills" 
                      placeholder="Type a skill and press Enter (e.g. React, Python)" 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                    <Button type="button" variant="secondary" onClick={() => addSkill(skillInput)}>
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t p-6 bg-muted/20">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!formData.preferredRole || skills.length === 0}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-primary" /> AI Resume Analysis
                </CardTitle>
                <CardDescription>Upload your resume to extract skills automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!resumeFilename ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-1">Click to upload resume</h3>
                    <p className="text-sm text-muted-foreground">PDF or Word doc (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          <FileUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{resumeFilename}</p>
                          <p className="text-xs text-muted-foreground">Ready for analysis</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => { setResumeFilename(null); setAnalysisResult(null); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {!analysisResult ? (
                      <Button 
                        onClick={handleAnalyzeResume} 
                        disabled={isAnalyzing} 
                        className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        {isAnalyzing ? (
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 animate-spin" /> Analyzing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> Analyze Resume with AI
                          </span>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 border border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-900/10 rounded-xl space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5" /> Skills Extracted
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {analysisResult.skillsFound.map(skill => (
                                <Badge key={skill} variant="outline" className="bg-background">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">Strengths</h4>
                              <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside pl-2">
                                {analysisResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">Suggestions</h4>
                              <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside pl-2">
                                {analysisResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" onClick={handleMergeSkills} className="w-full">
                          Update Profile with Extracted Skills
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between border-t p-6 bg-muted/20">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleComplete} className="bg-primary shadow-md hover-elevate">
                  Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
