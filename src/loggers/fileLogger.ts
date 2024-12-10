import fs from "fs/promises";
import path from "path";
import type { AuditLogger, AuditLogEntry } from "../types";
import { isNodeError } from "../utils/errorUtils";

export class FileLogger implements AuditLogger {
  private format: "json" | "csv";
  private basePath: string;

  constructor(format: "json" | "csv", basePath: string) {
    this.format = format;
    this.basePath = basePath;
  }

  async log(entry: AuditLogEntry): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const filePath = path.join(
      this.basePath,
      `audit-log-${today}.${this.format}`
    );

    await fs.mkdir(this.basePath, { recursive: true });

    if (this.format === "json") await this.appendJsonLog(filePath, entry);
    else await this.appendCsvLog(filePath, entry);
  }

  private async appendJsonLog(
    filePath: string,
    entry: AuditLogEntry
  ): Promise<void> {
    try {
      const existingContent = await fs.readFile(filePath, "utf-8");
      const logEntries: AuditLogEntry[] = JSON.parse(existingContent);
      logEntries.push(entry);

      await fs.writeFile(
        filePath,
        JSON.stringify(logEntries, null, 2),
        "utf-8"
      );
    } catch (error: unknown) {
      if (isNodeError(error) && error.code === "ENOENT") {
        const logEntries = [entry];
        await fs.writeFile(
          filePath,
          JSON.stringify(logEntries, null, 2),
          "utf-8"
        );
      } else if (error instanceof SyntaxError) {
        const logEntries = [entry];
        await fs.writeFile(
          filePath,
          JSON.stringify(logEntries, null, 2),
          "utf-8"
        );
      } else {
        throw error;
      }
    }
  }

  private async appendCsvLog(
    filePath: string,
    entry: AuditLogEntry
  ): Promise<void> {
    const headers = Object.keys(entry).join(",");
    const values = Object.values(entry)
      .map((v) => `"${v}"`)
      .join(",");

    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, headers + "\n", "utf-8");
    }

    await fs.appendFile(filePath, values + "\n", "utf-8");
  }
}
