import { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SkillTag } from "../components/common/SkillTag";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Mail, Phone, GraduationCap, Briefcase, FileUp, Save, Sparkles, FileText } from "lucide-react";
import { analyzeResume } from "../utils/resumeAnalyzer";

const ROLES = [
  "Frontend Dev", "Backend Dev", "Full Stack Dev", "Data Science", 
  "ML/AI", "DevOps", "UI/UX Design", "Product Management", "Marketing", "Other"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Master's"];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    college: user?.college || "",
    year: user?.year || "",
    preferredRole: user?.preferredRole || "",
  });
  
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleSave = () => {
    if (user) {
      updateUser({
        ...user,
        ...formData,
        skills
      });
      setIsEditing(false);
      toast({ description: "Profile updated successfully" });
    }
  };

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeResume(user?.resumeFilename || "resume.pdf", skills);
      const newSkills = [...new Set([...skills, ...result.skillsFound])];
      setSkills(newSkills);
      setIsAnalyzing(false);
      toast({ description: "Resume re-analyzed! Added missing skills." });
      
      // Auto save if not editing
      if (!isEditing && user) {
        updateUser({
          ...user,
          skills: newSkills
        });
      }
    }, 1500);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and skills.</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
          className="gap-2"
        >
          {isEditing ? <><Save className="h-4 w-4" /> Save Changes</> : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden text-center pt-8 pb-6">
            <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-lg mb-4 bg-primary/10">
              <AvatarFallback className="text-3xl font-bold text-primary">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p className="text-muted-foreground font-medium">{formData.preferredRole || "Student"}</p>
            <div className="mt-6 flex justify-center">
              <Badge variant="secondary" className="px-3 py-1">
                {skills.length} Skills Listed
              </Badge>
            </div>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileUp className="h-5 w-5 text-primary" /> Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {user?.resumeFilename || "resume.pdf"}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full text-xs h-9" 
                onClick={handleReanalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Sparkles className="h-3 w-3 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="h-3 w-3 mr-2 text-primary" /> Re-analyze Resume</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact and education details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Full Name</Label>
                  {isEditing ? (
                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border border-transparent rounded-md bg-muted/20">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formData.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email Address</Label>
                  {isEditing ? (
                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border border-transparent rounded-md bg-muted/20">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase text-muted-foreground">Phone Number</Label>
                  {isEditing ? (
                    <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border border-transparent rounded-md bg-muted/20">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formData.phone || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-semibold uppercase text-muted-foreground">Preferred Role</Label>
                  {isEditing ? (
                    <Select value={formData.preferredRole} onValueChange={(v) => handleInputChange("preferredRole", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 border border-transparent rounded-md bg-muted/20">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formData.preferredRole || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college" className="text-xs font-semibold uppercase text-muted-foreground">College / University</Label>
                  {isEditing ? (
                    <Input id="college" value={formData.college} onChange={(e) => handleInputChange("college", e.target.value)} />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border border-transparent rounded-md bg-muted/20">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formData.college || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-xs font-semibold uppercase text-muted-foreground">Year of Study</Label>
                  {isEditing ? (
                    <Select value={formData.year} onValueChange={(v) => handleInputChange("year", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 border border-transparent rounded-md bg-muted/20">
                      <span className="h-4 w-4 flex items-center justify-center text-muted-foreground text-xs font-bold">Yr</span>
                      <span className="font-medium">{formData.year || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add skills to improve your internship matches</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="flex gap-2 mb-6">
                  <Input 
                    placeholder="Type a skill and press Enter..." 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    className="max-w-md"
                  />
                  <Button type="button" variant="secondary" onClick={() => addSkill(skillInput)}>
                    Add
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                ) : (
                  skills.map(skill => (
                    <SkillTag 
                      key={skill} 
                      skill={skill} 
                      onRemove={isEditing ? () => removeSkill(skill) : undefined} 
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
