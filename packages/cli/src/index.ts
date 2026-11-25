#!/usr/bin/env node
import { Command } from "commander";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { scanWorkspace } from "@jyn/core";
import path from "node:path";

const program = new Command();

program
  .name("jyn")
  .description("Just You Need - Optimize your dsh workspace configuration")
  .version("0.1.0");

program
  .command("analyze")
  .description("Analyze current workspace and suggest plugin optimizations")
  .option("-p, --path <path>", "Path to workspace", process.cwd())
  .action(async (options) => {
    p.intro(pc.bgCyan(pc.black(" JYN Analyzer ")));

    const s = p.spinner();
    s.start("Scanning workspace manifest and active plugins...");

    try {
      const workspacePath = path.resolve(options.path);
      const profile = await scanWorkspace(workspacePath);

      s.stop(pc.green("Scan complete."));

      if (profile.techStack.length === 0) {
        p.note(
          pc.yellow(
            "Could not detect any specific tech stack in this directory.",
          ),
          "Result",
        );
        p.outro("Nothing to optimize here. (Are you in the right folder?)");
        return;
      }

      p.note(
        `Detected Tech Stack: ${pc.bold(profile.techStack.join(", "))}\n` +
          `Active Plugins: ${profile.activePlugins.length}\n` +
          `Active Skills: ${profile.activeSkills.length}\n` +
          `Estimated Base Token Cost: ${pc.yellow(profile.totalEstimatedTokenCost)} tokens`,
        "Workspace Profile",
      );

      // Simulasi rekomendasi (Nanti ini akan datang dari LLM / Rule Engine)
      const mockRecommendations = [
        {
          action: "disable",
          target: "unused-mcp-python",
          reason: "Not relevant for a TypeScript project.",
        },
        {
          action: "install",
          target: "skill-react-expert",
          reason: "Detected React in dependencies.",
        },
      ];

      if (mockRecommendations.length > 0) {
        p.note(
          mockRecommendations
            .map(
              (r) =>
                `${pc.cyan(r.action.toUpperCase())} ${r.target} - ${r.reason}`,
            )
            .join("\n"),
          "Optimization Suggestions (Simulated)",
        );

        const mode = await p.select({
          message: "How do you want to proceed?",
          options: [
            { value: "auto", label: "Auto-fix (Apply recommendations)" },
            { value: "manual", label: "Review manually (Coming soon)" },
            { value: "cancel", label: "Cancel" },
          ],
        });

        if (p.isCancel(mode) || mode === "cancel") {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        p.outro(
          pc.green("Done! (Auto-fix logic will be implemented in next phase)"),
        );
      } else {
        p.outro("Your workspace is already optimized!");
      }
    } catch (error) {
      s.stop(pc.red("Scan failed."));
      p.log.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv);
