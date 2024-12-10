import { Client } from "@elastic/elasticsearch";
import type { AuditLogger, AuditLogEntry } from "../types";

export class ElasticSearchLogger implements AuditLogger {
  private client: Client;
  private index: string;

  constructor(config: {
    node: string;
    index: string;
    auth?: { username: string; password: string };
  }) {
    this.client = new Client({
      node: config.node,
      auth: config.auth
        ? {
            username: config.auth.username,
            password: config.auth.password,
          }
        : undefined,
    });
    this.index = config.index;
  }

  async log(entry: AuditLogEntry): Promise<void> {
    await this.client.index({
      index: this.index,
      document: entry,
    });
  }
}
