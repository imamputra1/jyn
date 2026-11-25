import { describe, it, expect } from "vitest";
import { scanWorkspace } from "./scanner.js";
import path from "node:path";

describe("Scanner", () => {
  it("should detect the tech stack of the JYN monorepo itself", async () => {
    // process.cwd() saat vitest berjalan adalah 'packages/core'
    // Kita mundur 2 level (../..) untuk sampai ke root 'jyn'
    const workspacePath = path.resolve(process.cwd(), "../..");

    const profile = await scanWorkspace(workspacePath);

    // Karena monorepo ini menggunakan TypeScript, scanner harus mendeteksinya
    expect(profile.techStack).toContain("typescript");
    expect(profile.path).toBe(workspacePath);

    // Opsional: cetak hasilnya untuk memastikan
    console.log("Hasil Scan Workspace:", profile);
  });
});
