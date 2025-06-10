# Enhanced Browserbase MCP

**The ultimate browser automation MCP combining Stagehand simplicity with Playwright power.**

## 🚀 Features

### Dual Automation Approaches
- **Simple Automation**: Stagehand for quick, AI-powered interactions
- **Advanced Automation**: Full Playwright API for sophisticated workflows

### Capabilities
- ✅ **Hybrid Architecture**: Best of both worlds - simplicity + power
- ✅ **Session Management**: Track and manage multiple browser sessions
- ✅ **Performance Testing**: Built-in metrics and load time analysis
- ✅ **Multi-page Workflows**: Complex automation across multiple pages
- ✅ **Form Automation**: Intelligent form filling and submission
- ✅ **Custom Scripts**: Execute arbitrary JavaScript in browser context
- ✅ **Screenshot Capture**: Visual verification and debugging
- ✅ **Network Interception**: Monitor and modify network requests
- ✅ **Railway Ready**: Optimized for cloud deployment

## 🔧 Environment Variables

```bash
BROWSERBASE_API_KEY=your_browserbase_api_key    # Optional for cloud mode
BROWSERBASE_PROJECT_ID=your_project_id          # Optional for cloud mode
PORT=3000                                       # Server port
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### MCP Integration (Claude)
```bash
POST /mcp
{
  "tool": "simple_automation",
  "params": {
    "action": "click the login button",
    "url": "https://example.com"
  }
}
```

### Simple Automation (Stagehand)
```bash
POST /automation/simple
{
  "action": "click the submit button and wait for confirmation",
  "url": "https://example.com/form"
}
```

### Advanced Automation (Playwright)
```bash
POST /automation/advanced
{
  "script": {
    "type": "navigate_and_interact",
    "params": {
      "url": "https://example.com",
      "interactions": [
        {
          "action": "click",
          "selector": "#login-btn"
        },
        {
          "action": "type", 
          "selector": "#username",
          "value": "testuser"
        },
        {
          "action": "screenshot",
          "options": { "fullPage": true }
        }
      ]
    }
  }
}
```

## 🎯 Advanced Script Types

### 1. Navigate and Interact
Perfect for step-by-step page interactions:
```javascript
{
  "type": "navigate_and_interact",
  "params": {
    "url": "https://app.example.com",
    "interactions": [
      { "action": "click", "selector": ".nav-item" },
      { "action": "wait", "selector": ".content-loaded" },
      { "action": "screenshot", "options": { "fullPage": true } }
    ]
  }
}
```

### 2. Scrape with Interaction
Extract data after performing interactions:
```javascript
{
  "type": "scrape_with_interaction",
  "params": {
    "url": "https://data.example.com",
    "interactions": [
      { "selector": ".load-more-btn" }
    ],
    "selectors": {
      "title": "h1",
      "content": ".main-content",
      "metadata": ".meta-info"
    }
  }
}
```

### 3. Form Automation
Intelligent form handling:
```javascript
{
  "type": "form_automation",
  "params": {
    "url": "https://forms.example.com",
    "formData": {
      "#name": "John Doe",
      "#email": "john@example.com",
      "#message": "Hello world"
    },
    "submitSelector": "#submit-btn"
  }
}
```

### 4. Performance Testing
Analyze page performance:
```javascript
{
  "type": "performance_testing",
  "params": {
    "url": "https://example.com"
  }
}
```

### 5. Custom Scripts
Execute arbitrary JavaScript:
```javascript
{
  "type": "custom",
  "params": {
    "code": "return document.querySelectorAll('a').length;",
    "args": {}
  }
}
```

## 🔄 Multi-page Workflows

Chain multiple operations together:
```javascript
{
  "type": "multi_page_workflow", 
  "params": {
    "workflow": [
      {
        "type": "navigate_and_interact",
        "params": { "url": "https://step1.com", "interactions": [...] }
      },
      {
        "type": "form_automation",
        "params": { "url": "https://step2.com", "formData": {...} }
      },
      {
        "type": "scrape_with_interaction",
        "params": { "url": "https://step3.com", "selectors": {...} }
      }
    ]
  }
}
```

## 🚁 Railway Deployment

### Automatic Deployment
This MCP is optimized for Railway with:
- Automatic environment detection
- Health checks
- Graceful shutdown handling
- Session cleanup

### Railway Configuration
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

## 🎛️ Session Management

Track active automation sessions:
```bash
GET /sessions
# Returns: { "active_sessions": ["session_123", "session_456"] }
```

Sessions are automatically cleaned up after completion or errors.

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 🤖 Claude Integration

Use with Claude MCP configuration:
```json
{
  "mcpServers": {
    "browserbase-enhanced": {
      "command": "curl",
      "args": ["-X", "POST", "https://browserbase-mcp-enhanced.railway.app/mcp"]
    }
  }
}
```

## 🔐 Security

- Environment-based configuration
- Session isolation
- Automatic cleanup
- Error handling and logging

## 📊 Response Format

All endpoints return structured responses:
```json
{
  "method": "playwright|stagehand",
  "sessionId": "session_123",
  "result": { ... },
  "timestamp": "2024-12-10T...",
  "duration": 1234
}
```

## 🚀 Why This Approach?

### Stagehand (Simple)
- **Use for**: Quick interactions, AI-powered element detection
- **Benefits**: Minimal setup, natural language actions
- **Example**: "click the blue submit button"

### Playwright (Advanced)  
- **Use for**: Complex workflows, precise control, performance testing
- **Benefits**: Full API access, debugging tools, network interception
- **Example**: Multi-step forms with validation and error handling

### Best of Both Worlds
- Start simple with Stagehand for prototyping
- Upgrade to Playwright for production workflows
- Single service handles both approaches seamlessly

---

**Ready for Railway deployment and Claude integration!** 🚂