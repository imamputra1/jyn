import {
  WorkspaceProfile,
  CapabilityEntry,
  JynRecommendation,
} from "./types.js";

export function generateRecommendations(
  profile: WorkspaceProfile,
  globalPlugins: CapabilityEntry[],
): JynRecommendation[] {
  const recommendations: JynRecommendation[] = [];
  const workspaceNeeds = new Set(profile.techStack);

  for (const plugin of globalPlugins) {
    // Cek apakah plugin ini relevan dengan tech stack workspace
    const isRelevant = plugin.triggers.some((trigger) =>
      workspaceNeeds.has(trigger),
    );

    if (!isRelevant && plugin.id !== "skill-git-guardrails") {
      // Jika tidak relevan dan bukan plugin core (seperti git), rekomendasikan DISABLE
      recommendations.push({
        action: "disable",
        targetId: plugin.id,
        reason: `Not relevant for a ${profile.techStack.join(", ")} project. Saves ~${plugin.tokensCost} tokens.`,
        estimatedTokenSavings: plugin.tokensCost,
      });
    } else if (isRelevant) {
      // Jika relevan, pastikan dia aktif (untuk saat ini kita anggap aktif)
    }
  }

  // Cek apakah ada skill yang direkomendasikan tapi belum diinstal
  if (
    workspaceNeeds.has("react") &&
    !globalPlugins.some((p) => p.id === "skill-react-expert")
  ) {
    recommendations.push({
      action: "install",
      targetId: "skill-react-expert",
      reason:
        "Detected React. Installing this skill will improve code generation quality.",
    });
  }

  return recommendations;
}
