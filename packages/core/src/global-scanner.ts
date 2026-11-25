import { CapabilityEntry } from "./types.js";

// Mock: Anggap saja ini adalah daftar plugin yang terinstal secara global di dsh
export const MOCK_GLOBAL_PLUGINS: CapabilityEntry[] = [
  {
    id: "mcp-postgres",
    name: "PostgreSQL MCP",
    type: "mcp",
    scope: "global",
    description: "Database access",
    triggers: ["database", "sql"],
    tokensCost: 1200,
  },
  {
    id: "skill-react-expert",
    name: "React Expert",
    type: "skill",
    scope: "global",
    description: "React patterns",
    triggers: ["react", "frontend"],
    tokensCost: 800,
  },
  {
    id: "mcp-python-env",
    name: "Python Env Manager",
    type: "mcp",
    scope: "global",
    description: "Python virtualenv management",
    triggers: ["python"],
    tokensCost: 1500,
  },
  {
    id: "skill-git-guardrails",
    name: "Git Guardrails",
    type: "skill",
    scope: "global",
    description: "Prevents dangerous git commands",
    triggers: ["git"],
    tokensCost: 500,
  },
];

export async function scanGlobalConfig(): Promise<CapabilityEntry[]> {
  // Di masa depan, ini akan membaca dari ~/.dsh/cordis.yml atau database
  return MOCK_GLOBAL_PLUGINS;
}
