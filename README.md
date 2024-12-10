# 🎯 Audit Log Middleware

A powerful middleware for logging user activities in your Express applications.

## ✨ Features

- 📝 Automatically captures relevant data:
  - User information
  - Endpoint accessed
  - HTTP method
  - Date and time
  - Request body details
- 🔧 Configurable detail levels (basic, intermediate, complete)
- 💾 Export options:
  - JSON files
  - CSV files
  - External services (Elasticsearch)

## 🎯 Use Cases

- 📋 Applications requiring audit trails (e.g., GDPR or HIPAA compliance)
- 📊 Internal application monitoring
- 🔍 User activity tracking
- 🛡️ Security logging

## 🚀 Installation

```bash
npm install audit-log-middleware
```

## 📖 Basic Usage

```javascript
const express = require("express");
const { createAuditMiddleware } = require("audit-log-middleware");

const app = express();

// Basic audit middleware configuration
const auditMiddleware = createAuditMiddleware({
  level: "complete",
  storage: {
    type: "file",
    options: {
      filename: "audit-logs.json",
    },
  },
});

// Apply middleware globally
app.use(auditMiddleware);
```

## 📝 Example Output

```json
[
  {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "userId": "user123",
    "method": "GET",
    "endpoint": "/users/1",
    "userAgent": "Mozilla/5.0 (compatible; ExampleBrowser/1.0)",
    "ip": "71.198.38.7",
    "responseStatus": 200
  },
  {
    "timestamp": "2024-01-01T12:01:00.000Z",
    "userId": "user123",
    "method": "GET",
    "endpoint": "/",
    "userAgent": "Mozilla/5.0 (compatible; ExampleBrowser/1.0)",
    "ip": "216.73.163.219",
    "responseStatus": 200,
    "responseBody": "{\"message\":\"Hello World!\"}"
  }
]
```

## ⚙️ Configuration Options

### Detail Levels

- `basic`: Logs only essential information
- `intermediate`: Adds request headers and response status
- `complete`: Includes full request and response details

### Storage Options

```javascript
// File storage
{
  type: 'file',
  options: {
    filename: 'audit-logs.json'
  }
}
// Elasticsearch storage
{
  type: 'elasticsearch',
  options: {
    node: 'http://localhost:9200',
    index: 'audit-logs'
  }
}
```

## 🔒 Security Considerations

- Sensitive data can be filtered out using the `exclude` option
- Supports data encryption for stored logs
- Compliant with common security standards

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
