const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Stagehand } = require('@browserbase/stagehand');
const { chromium, firefox, webkit } = require('playwright');
const { Browserbase } = require('@browserbase/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Enhanced Browserbase MCP Class
class BrowserbaseMCPEnhanced {
  constructor() {
    this.stagehandBrowserbase = null;
    this.playwrightBrowserbase = null;
    this.browserbaseSDK = null;
    this.sessions = new Map(); // Track active sessions
    this.browsers = new Map(); // Track browser instances
  }

  // Initialize Browserbase SDK
  async initBrowserbaseSDK() {
    if (!this.browserbaseSDK) {
      this.browserbaseSDK = new Browserbase({
        apiKey: process.env.BROWSERBASE_API_KEY,
        projectId: process.env.BROWSERBASE_PROJECT_ID
      });
    }
    return this.browserbaseSDK;
  }

  // Initialize Stagehand + Browserbase (AI-powered automation)
  async initStagehandBrowserbase() {
    if (!this.stagehandBrowserbase) {
      this.stagehandBrowserbase = new Stagehand({
        apiKey: process.env.BROWSERBASE_API_KEY,
        projectId: process.env.BROWSERBASE_PROJECT_ID,
        env: "BROWSERBASE" // Forces Browserbase cloud infrastructure
      });
      await this.stagehandBrowserbase.init();
    }
    return this.stagehandBrowserbase;
  }

  // Initialize Playwright + Browserbase (full control automation)
  async initPlaywrightBrowserbase(browserType = 'chromium') {
    const browserKey = `${browserType}_browserbase`;
    
    if (!this.browsers.has(browserKey)) {
      const wsEndpoint = `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}&projectId=${process.env.BROWSERBASE_PROJECT_ID}`;
      
      let browser;
      switch (browserType) {
        case 'firefox':
          browser = await firefox.connect({ wsEndpoint });
          break;
        case 'webkit':
          browser = await webkit.connect({ wsEndpoint });
          break;
        case 'chromium':
        default:
          browser = await chromium.connect({ wsEndpoint });
          break;
      }
      
      this.browsers.set(browserKey, browser);
    }
    
    return this.browsers.get(browserKey);
  }

  // AI-powered automation using Stagehand + Browserbase (undetectable)
  async aiAutomation(action, url = null, options = {}) {
    const stagehand = await this.initStagehandBrowserbase();
    
    if (url) {
      await stagehand.page.goto(url);
    }

    const result = await stagehand.page.act({ action });
    return {
      method: 'stagehand+browserbase',
      action,
      result,
      undetectable: true,
      timestamp: new Date().toISOString()
    };
  }

  // Advanced automation using Playwright + Browserbase (full control + undetectable)
  async advancedAutomation(script, options = {}) {
    const browserType = options.browserType || 'chromium';
    const browser = await this.initPlaywrightBrowserbase(browserType);
    const context = await browser.newContext({
      viewport: options.viewport || { width: 1920, height: 1080 },
      userAgent: options.userAgent || 'BrowserbaseMCP/1.0',
      ...options.contextOptions
    });

    const page = await context.newPage();
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.sessions.set(sessionId, { context, page, startTime: Date.now() });

    try {
      // Execute the advanced script
      const result = await this.executePlaywrightScript(page, script, options);
      
      return {
        method: 'playwright+browserbase',
        browserType: options.browserType || 'chromium',
        sessionId,
        script: script.name || 'custom_script',
        result,
        undetectable: true,
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.sessions.get(sessionId).startTime
      };
    } catch (error) {
      throw {
        method: 'playwright',
        sessionId,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    } finally {
      // Clean up session
      if (this.sessions.has(sessionId)) {
        await context.close();
        this.sessions.delete(sessionId);
      }
    }
  }

  // Execute sophisticated Playwright automation
  async executePlaywrightScript(page, script, options) {
    const { type, params } = script;

    switch (type) {
      case 'navigate_and_interact':
        return await this.navigateAndInteract(page, params);
      
      case 'scrape_with_interaction':
        return await this.scrapeWithInteraction(page, params);
      
      case 'form_automation':
        return await this.formAutomation(page, params);
      
      case 'multi_page_workflow':
        return await this.multiPageWorkflow(page, params);
      
      case 'performance_testing':
        return await this.performanceTesting(page, params);
      
      case 'custom':
        return await this.customScript(page, params);
      
      default:
        throw new Error(`Unknown script type: ${type}`);
    }
  }

  // Navigation and interaction workflow
  async navigateAndInteract(page, params) {
    const { url, interactions } = params;
    
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    const results = [];
    
    for (const interaction of interactions) {
      const { action, selector, value, options } = interaction;
      
      switch (action) {
        case 'click':
          await page.locator(selector).click(options);
          break;
        case 'type':
          await page.locator(selector).fill(value);
          break;
        case 'wait':
          await page.waitForSelector(selector, options);
          break;
        case 'screenshot':
          const screenshot = await page.screenshot(options);
          results.push({ action, screenshot: screenshot.toString('base64') });
          break;
      }
    }
    
    return { url, interactions: results };
  }

  // Advanced scraping with interactions
  async scrapeWithInteraction(page, params) {
    const { url, selectors, interactions } = params;
    
    await page.goto(url);
    
    // Perform interactions first
    for (const interaction of interactions || []) {
      await page.locator(interaction.selector).click();
      await page.waitForTimeout(1000);
    }
    
    // Extract data
    const data = {};
    for (const [key, selector] of Object.entries(selectors)) {
      data[key] = await page.locator(selector).textContent();
    }
    
    return { url, data };
  }

  // Form automation
  async formAutomation(page, params) {
    const { url, formData, submitSelector } = params;
    
    await page.goto(url);
    
    for (const [selector, value] of Object.entries(formData)) {
      await page.locator(selector).fill(value);
    }
    
    if (submitSelector) {
      await page.locator(submitSelector).click();
      await page.waitForLoadState('networkidle');
    }
    
    return { url, formSubmitted: true };
  }

  // Multi-page workflow
  async multiPageWorkflow(page, params) {
    const { workflow } = params;
    const results = [];
    
    for (const step of workflow) {
      const stepResult = await this.executePlaywrightScript(page, step);
      results.push(stepResult);
    }
    
    return { workflow: results };
  }

  // Performance testing
  async performanceTesting(page, params) {
    const { url } = params;
    
    const startTime = Date.now();
    await page.goto(url);
    const loadTime = Date.now() - startTime;
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    });
    
    return { url, loadTime, metrics };
  }

  // Custom script execution
  async customScript(page, params) {
    const { code, args } = params;
    
    // Execute custom JavaScript in browser context
    const result = await page.evaluate(new Function('args', code), args);
    
    return { custom: true, result };
  }

  // Cleanup resources
  async cleanup() {
    if (this.stagehandBrowserbase) {
      await this.stagehandBrowserbase.close();
    }
    
    // Close all browser instances
    for (const [key, browser] of this.browsers) {
      try {
        await browser.close();
      } catch (error) {
        console.error(`Error closing browser ${key}:`, error.message);
      }
    }
    this.browsers.clear();
    
    // Clear all sessions
    this.sessions.clear();
  }
}

// Initialize the enhanced MCP
const browserbaseMCP = new BrowserbaseMCPEnhanced();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'browserbase-mcp-enhanced',
    capabilities: ['stagehand', 'playwright'],
    timestamp: new Date().toISOString()
  });
});

// MCP endpoint (for Claude integration)
app.post('/mcp', async (req, res) => {
  try {
    const { tool, params } = req.body;
    
    let result;
    
    switch (tool) {
      case 'ai_automation':
        result = await browserbaseMCP.aiAutomation(params.action, params.url, params.options);
        break;
      
      case 'advanced_automation':
        result = await browserbaseMCP.advancedAutomation(params.script, params.options);
        break;
      
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
    
    res.json({ success: true, result });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// AI-powered automation endpoint (Stagehand + Browserbase)
app.post('/automation/ai', async (req, res) => {
  try {
    const { action, url, options } = req.body;
    const result = await browserbaseMCP.aiAutomation(action, url, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced automation endpoint
app.post('/automation/advanced', async (req, res) => {
  try {
    const { script, options } = req.body;
    const result = await browserbaseMCP.advancedAutomation(script, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Session management
app.get('/sessions', (req, res) => {
  const sessions = Array.from(browserbaseMCP.sessions.keys());
  res.json({ active_sessions: sessions });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await browserbaseMCP.cleanup();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Enhanced Browserbase MCP running on port ${PORT}`);
  console.log(`🤖 AI automation (Stagehand+BB): POST /automation/ai`);
  console.log(`🎯 Advanced automation (Playwright+BB): POST /automation/advanced`);
  console.log(`❤️ Health check: GET /health`);
  console.log(`🔒 Bot detection: BYPASSED via Browserbase`);
});

module.exports = app;