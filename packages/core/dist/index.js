// src/scanner.ts
import fs from "fs/promises";
import path from "path";
async function scanWorkspace(workspacePath) {
  const techStack = /* @__PURE__ */ new Set();
  const activePlugins = [];
  const activeMcps = [];
  const activeSkills = [];
  try {
    const pkgPath = path.join(workspacePath, "package.json");
    const pkgContent = await fs.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgContent);
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (allDeps["react"]) techStack.add("react");
    if (allDeps["vue"]) techStack.add("vue");
    if (allDeps["svelte"]) techStack.add("svelte");
    if (allDeps["express"] || allDeps["fastify"] || allDeps["hono"])
      techStack.add("backend");
    if (allDeps["typescript"]) techStack.add("typescript");
    if (allDeps["prisma"] || allDeps["drizzle-orm"])
      techStack.add("database-orm");
  } catch (error) {
  }
  try {
    const pyPath = path.join(workspacePath, "pyproject.toml");
    await fs.access(pyPath);
    techStack.add("python");
  } catch (error) {
  }
  try {
    const cordisPath = path.join(workspacePath, "cordis.yml");
    const cordisContent = await fs.readFile(cordisPath, "utf-8");
    activePlugins.push("detected-cordis-yml");
  } catch (error) {
  }
  try {
    const skillsPath = path.join(workspacePath, ".dsh", "skills");
    const skills = await fs.readdir(skillsPath);
    activeSkills.push(...skills);
  } catch (error) {
  }
  return {
    path: workspacePath,
    techStack: Array.from(techStack),
    activePlugins,
    activeMcps,
    activeSkills,
    totalEstimatedTokenCost: 0
    // Akan dihitung nanti
  };
}

// src/global-scanner.ts
var MOCK_GLOBAL_PLUGINS = [
  {
    id: "mcp-postgres",
    name: "PostgreSQL MCP",
    type: "mcp",
    scope: "global",
    description: "Database access",
    triggers: ["database", "sql"],
    tokensCost: 1200
  },
  {
    id: "skill-react-expert",
    name: "React Expert",
    type: "skill",
    scope: "global",
    description: "React patterns",
    triggers: ["react", "frontend"],
    tokensCost: 800
  },
  {
    id: "mcp-python-env",
    name: "Python Env Manager",
    type: "mcp",
    scope: "global",
    description: "Python virtualenv management",
    triggers: ["python"],
    tokensCost: 1500
  },
  {
    id: "skill-git-guardrails",
    name: "Git Guardrails",
    type: "skill",
    scope: "global",
    description: "Prevents dangerous git commands",
    triggers: ["git"],
    tokensCost: 500
  }
];
async function scanGlobalConfig() {
  return MOCK_GLOBAL_PLUGINS;
}

// src/rules.ts
function generateRecommendations(profile, globalPlugins) {
  const recommendations = [];
  const workspaceNeeds = new Set(profile.techStack);
  for (const plugin of globalPlugins) {
    const isRelevant = plugin.triggers.some(
      (trigger) => workspaceNeeds.has(trigger)
    );
    if (!isRelevant && plugin.id !== "skill-git-guardrails") {
      recommendations.push({
        action: "disable",
        targetId: plugin.id,
        reason: `Not relevant for a ${profile.techStack.join(", ")} project. Saves ~${plugin.tokensCost} tokens.`,
        estimatedTokenSavings: plugin.tokensCost
      });
    } else if (isRelevant) {
    }
  }
  if (workspaceNeeds.has("react") && !globalPlugins.some((p) => p.id === "skill-react-expert")) {
    recommendations.push({
      action: "install",
      targetId: "skill-react-expert",
      reason: "Detected React. Installing this skill will improve code generation quality."
    });
  }
  return recommendations;
}
export {
  MOCK_GLOBAL_PLUGINS,
  generateRecommendations,
  scanGlobalConfig,
  scanWorkspace
};
