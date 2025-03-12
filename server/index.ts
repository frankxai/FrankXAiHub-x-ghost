import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createPromptEngineeringPost } from "./create-prompt-engineering-post";
import { spawn } from "child_process";
import { join } from "path";
import { existsSync } from "fs";

// Function to start OpenWebUI server
function startOpenWebUI() {
  const openWebUIPath = join(process.cwd(), 'openwebui');
  if (!existsSync(openWebUIPath)) {
    log("OpenWebUI directory not found, skipping startup", "server");
    return;
  }

  log("Starting OpenWebUI server on port 8080...", "server");
  
  const child = spawn('npm', ['run', 'dev', '--', '--port', '8080'], {
    cwd: openWebUIPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
    shell: true
  });
  
  child.stdout.on('data', (data) => {
    log(`OpenWebUI: ${data.toString().trim()}`, "openwebui");
  });
  
  child.stderr.on('data', (data) => {
    log(`OpenWebUI Error: ${data.toString().trim()}`, "openwebui-error");
  });
  
  child.on('close', (code) => {
    log(`OpenWebUI process exited with code ${code}`, "openwebui");
  });
  
  child.on('error', (error) => {
    log(`Failed to start OpenWebUI: ${error}`, "openwebui-error");
  });
  
  // Unreference to ensure the parent can exit without being blocked
  child.unref();
  
  process.on('exit', () => {
    log("Main server exiting, killing OpenWebUI server", "server");
    try {
      if (child.pid) {
        process.kill(-child.pid, 'SIGTERM');
      }
    } catch (e) {
      // Ignore errors when killing the process
    }
  });
  
  return child;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Create the prompt engineering blog post
  try {
    await createPromptEngineeringPost();
    log("Prompt engineering blog post created successfully", "server");
  } catch (error) {
    log("Failed to create prompt engineering blog post: " + error, "server");
  }
  
  let server;
  try {
    server = await registerRoutes(app);
    log("Routes registered successfully", "server");
  } catch (error) {
    log(`Failed to register routes: ${error}`, "server");
    process.exit(1);
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    log(`Error: ${message}`, "server-error");
    
    res.status(status).json({ 
      message,
      status,
      timestamp: new Date().toISOString()
    });
    
    // Don't throw after handling, as it might crash the server
    // Only log the error
    console.error(err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Start OpenWebUI after main server is running
    startOpenWebUI();
  });
})();
