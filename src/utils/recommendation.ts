import { Internship } from "../data/internships";

export interface RecommendedInternship extends Internship {
  matchPercent: number;
  reason: string;
}

export const getRecommendations = (
  internships: Internship[],
  userSkills: string[]
): RecommendedInternship[] => {
  if (!userSkills || userSkills.length === 0) {
    return internships.map((internship) => ({
      ...internship,
      matchPercent: 0,
      reason: "Add skills to your profile to see why this matches.",
    }));
  }

  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  const recommended = internships.map((internship) => {
    const internshipSkillsLower = internship.skills.map((s) => s.toLowerCase());
    
    let matchCount = 0;
    const matchedSkills: string[] = [];
    
    internshipSkillsLower.forEach((iSkill, idx) => {
      // Simple inclusion check
      if (userSkillsLower.some((uSkill) => iSkill.includes(uSkill) || uSkill.includes(iSkill))) {
        matchCount++;
        matchedSkills.push(internship.skills[idx]);
      }
    });

    const matchPercent = Math.round((matchCount / internship.skills.length) * 100);
    
    let reason = "";
    if (matchPercent >= 80) {
      reason = `Excellent match! Your skills in ${matchedSkills.slice(0, 2).join(" and ")} align perfectly.`;
    } else if (matchPercent >= 50) {
      reason = `Good match. You have some required skills like ${matchedSkills[0] || "relevant tech"}.`;
    } else if (matchPercent > 0) {
      reason = `Partial match. Consider learning more about ${internship.skills.filter(s => !matchedSkills.includes(s)).slice(0, 2).join(", ")}.`;
    } else {
      reason = `Low match. This role requires ${internship.skills.slice(0, 2).join(" and ")}.`;
    }

    return {
      ...internship,
      matchPercent,
      reason,
    };
  });

  return recommended.sort((a, b) => b.matchPercent - a.matchPercent);
};
