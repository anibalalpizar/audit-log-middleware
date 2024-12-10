import type { Request, Response, NextFunction } from "express";
import type { AuditLogConfig, AuditLogEntry } from "../types";
import { FileLogger } from "../loggers/fileLogger";
import { ElasticSearchLogger } from "../loggers/elasticSearchLogger";

export const createAuditMiddleware = (config: AuditLogConfig) => {
  const logger = config.elasticSearch
    ? new ElasticSearchLogger(config.elasticSearch)
    : new FileLogger(
        config.exportFormat || "json",
        config.exportPath || "./audit-logs"
      );

  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId: (req as any).user?.id || "anonymous",
      method: req.method,
      endpoint: req.originalUrl,
      requestBody: config.level !== "basic" ? req.body : undefined,
      userAgent:
        config.level === "complete" ? req.headers["user-agent"] : undefined,
      ip: config.level === "complete" ? req.ip : undefined,
    };

    res.on("finish", async () => {
      entry.responseStatus = res.statusCode;
      if (config.level === "complete") entry.responseBody = responseBody;

      await logger.log(entry);
    });

    next();
  };
};
