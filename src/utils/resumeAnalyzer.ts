const MASTER_SKILLS = [
  "React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", "C++", 
  "Machine Learning", "Data Analysis", "SQL", "MongoDB", "AWS", "Docker", 
  "Kubernetes", "Figma", "UI/UX", "Product Management", "Agile", "SEO",
  "HTML", "CSS", "Tailwind CSS", "Redux", "Express", "PostgreSQL", "Git",
  "Data Structures", "Algorithms", "NLP", "Deep Learning", "TensorFlow", "PyTorch"
];

export interface ResumeAnalysisResult {
  skillsFound: string[];
  strengths: string[];
  weakAreas: string[];
  suggestions: string[];
}

export const analyzeResume = (filename: string, userEnteredSkills: string[]): ResumeAnalysisResult => {
  // Simulate AI analysis by picking random skills from the master list
  // and merging with some user entered skills
  
  const extractedSkills = [...userEnteredSkills];
  
  // Add 2-4 random skills based on filename length to simulate "found" skills
  const numRandomSkills = (filename.length % 3) + 2;
  for (let i = 0; i < numRandomSkills; i++) {
    const randomSkill = MASTER_SKILLS[Math.floor(Math.random() * MASTER_SKILLS.length)];
    if (!extractedSkills.includes(randomSkill)) {
      extractedSkills.push(randomSkill);
    }
  }

  return {
    skillsFound: extractedSkills,
    strengths: [
      "Good foundational technical knowledge demonstrated.",
      "Clear formatting allows easy parsing of experience.",
      `Strong focus on ${extractedSkills[0] || "core technologies"}.`
    ],
    weakAreas: [
      "Could quantify achievements with more metrics.",
      "Missing links to portfolio or GitHub repository."
    ],
    suggestions: [
      "Add measurable impact to your bullet points (e.g. 'Improved speed by 20%').",
      "Include a brief summary statement highlighting your career goals.",
      "Tailor your skills section to match the specific roles you're applying for."
    ]
  };
};
