import { Context, Schema } from "cordis";
import {
  scanWorkspace,
  scanGlobalConfig,
  generateRecommendations,
  JynRecommendation,
} from "@jyn/core";

export const name = "dsh-plugin-jyn";
export const inject = ["logger", "workspace"];

// Definisikan interface untuk tipe konfigurasi
interface JynConfig {
  autoOptimize: boolean;
  logRecommendations: boolean;
}

export const Config = Schema.object({
  autoOptimize: Schema.boolean()
    .default(false)
    .description("Automatically disable unused plugins on session start"),
  logRecommendations: Schema.boolean()
    .default(true)
    .description("Print JYN recommendations to the console"),
});

// Gunakan interface JynConfig sebagai tipe parameter
export function apply(ctx: Context, config: JynConfig) {
  ctx.logger.info(
    "JYN (Just You Need) Plugin loaded. Background optimizer is ready.",
  );

  // Kita gunakan (ctx as any) karena tipe event 'agent/pre-step'
  // adalah milik dsh, bukan milik cordis murni.
  (ctx as any).on("agent/pre-step", async (session: any) => {
    // Kita hanya mau berjalan di awal sesi (misal step pertama)
    if (session.step !== 1) return;

    try {
      const workspacePath = process.cwd(); // Asumsi dsh berjalan di root workspace

      const profile = await scanWorkspace(workspacePath);
      const globalPlugins = await scanGlobalConfig();
      const recommendations = generateRecommendations(profile, globalPlugins);

      if (recommendations.length > 0 && config.logRecommendations) {
        ctx.logger.warn(
          `[JYN] Found ${recommendations.length} optimization(s) for this workspace:`,
        );

        recommendations.forEach((r: JynRecommendation) => {
          ctx.logger.warn(
            `  - ${r.action.toUpperCase()} ${r.targetId}: ${r.reason}`,
          );
        });
      }

      if (
        config.autoOptimize &&
        recommendations.some((r: JynRecommendation) => r.action === "disable")
      ) {
        ctx.logger.info(
          "[JYN] Auto-optimize is ON. Disabling unnecessary plugins... (Implementation pending)",
        );
        // Di masa depan: ctx.registry.disable(pluginId)
      }
    } catch (error) {
      ctx.logger.error(
        `[JYN] Failed to analyze workspace: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });
}
