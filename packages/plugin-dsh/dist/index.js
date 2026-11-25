// src/index.ts
import { Schema } from "cordis";
import {
  scanWorkspace,
  scanGlobalConfig,
  generateRecommendations
} from "@jyn/core";
var name = "dsh-plugin-jyn";
var inject = ["logger", "workspace"];
var Config = Schema.object({
  autoOptimize: Schema.boolean().default(false).description("Automatically disable unused plugins on session start"),
  logRecommendations: Schema.boolean().default(true).description("Print JYN recommendations to the console")
});
function apply(ctx, config) {
  ctx.logger.info(
    "JYN (Just You Need) Plugin loaded. Background optimizer is ready."
  );
  ctx.on("agent/pre-step", async (session) => {
    if (session.step !== 1) return;
    try {
      const workspacePath = process.cwd();
      const profile = await scanWorkspace(workspacePath);
      const globalPlugins = await scanGlobalConfig();
      const recommendations = generateRecommendations(profile, globalPlugins);
      if (recommendations.length > 0 && config.logRecommendations) {
        ctx.logger.warn(
          `[JYN] Found ${recommendations.length} optimization(s) for this workspace:`
        );
        recommendations.forEach((r) => {
          ctx.logger.warn(
            `  - ${r.action.toUpperCase()} ${r.targetId}: ${r.reason}`
          );
        });
      }
      if (config.autoOptimize && recommendations.some((r) => r.action === "disable")) {
        ctx.logger.info(
          "[JYN] Auto-optimize is ON. Disabling unnecessary plugins... (Implementation pending)"
        );
      }
    } catch (error) {
      ctx.logger.error(
        `[JYN] Failed to analyze workspace: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}
export {
  Config,
  apply,
  inject,
  name
};
