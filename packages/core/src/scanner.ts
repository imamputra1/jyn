import fs from "node:fs/promises";
import path from "node:path";
import { WorkspaceProfile } from "./types.js";

/**
 * Memindai direktori workspace untuk mengumpulkan informasi tech stack
 * dan konfigurasi yang saat ini aktif.
 */
export async function scanWorkspace(
  workspacePath: string,
): Promise<WorkspaceProfile> {
  const techStack = new Set<string>();
  const activePlugins: string[] = [];
  const activeMcps: string[] = [];
  const activeSkills: string[] = [];

  try {
    // 1. Cek package.json (Node.js / TypeScript)
    const pkgPath = path.join(workspacePath, "package.json");
    const pkgContent = await fs.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgContent);

    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Deteksi tech stack umum
    if (allDeps["react"]) techStack.add("react");
    if (allDeps["vue"]) techStack.add("vue");
    if (allDeps["svelte"]) techStack.add("svelte");
    if (allDeps["express"] || allDeps["fastify"] || allDeps["hono"])
      techStack.add("backend");
    if (allDeps["typescript"]) techStack.add("typescript");
    if (allDeps["prisma"] || allDeps["drizzle-orm"])
      techStack.add("database-orm");
  } catch (error) {
    // Jika tidak ada package.json, abaikan (mungkin proyek Python, dll)
  }

  try {
    // 2. Cek pyproject.toml (Python)
    const pyPath = path.join(workspacePath, "pyproject.toml");
    await fs.access(pyPath);
    techStack.add("python");
  } catch (error) {
    // Abaikan
  }

  // 3. Deteksi konfigurasi dsh (cordis.yml atau .dsh/)
  try {
    const cordisPath = path.join(workspacePath, "cordis.yml");
    const cordisContent = await fs.readFile(cordisPath, "utf-8");
    // Untuk saat ini kita hanya cek keberadaannya.
    // Nanti kita bisa parse YAML-nya untuk melihat plugin yang aktif.
    activePlugins.push("detected-cordis-yml");
  } catch (error) {
    // Abaikan
  }

  // 4. Deteksi folder skills (jika ada)
  try {
    const skillsPath = path.join(workspacePath, ".dsh", "skills");
    const skills = await fs.readdir(skillsPath);
    activeSkills.push(...skills);
  } catch (error) {
    // Abaikan
  }

  return {
    path: workspacePath,
    techStack: Array.from(techStack),
    activePlugins,
    activeMcps,
    activeSkills,
    totalEstimatedTokenCost: 0, // Akan dihitung nanti
  };
}
