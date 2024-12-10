export interface AuditLogConfig {
    level: 'basic' | 'intermediate' | 'complete';
    exportFormat?: 'json' | 'csv';
    exportPath?: string;
    elasticSearch?: {
      node: string;
      index: string;
      auth?: {
        username: string;
        password: string;
      };
    };
  }
  
  export interface AuditLogEntry {
    timestamp: string;
    userId: string;
    method: string;
    endpoint: string;
    requestBody?: any;
    responseStatus?: number;
    responseBody?: any;
    userAgent?: string;
    ip?: string;
  }
  
  export interface AuditLogger {
    log(entry: AuditLogEntry): Promise<void>;
  }