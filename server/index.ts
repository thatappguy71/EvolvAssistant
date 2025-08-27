import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

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
      // Only log response data in development for debugging
      if (process.env.NODE_ENV === 'development' && capturedJsonResponse) {
        // Sanitize sensitive data before logging
        const sanitized = JSON.stringify(capturedJsonResponse, (key, value) => {
          if (key.toLowerCase().includes('password') || 
              key.toLowerCase().includes('secret') || 
              key.toLowerCase().includes('token') ||
              key.toLowerCase().includes('api_key')) {
            return '[REDACTED]';
          }
          return value;
        });
        logLine += ` :: ${sanitized}`;
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
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      // Log error details only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error handling middleware:', err);
      } else {
        // In production, log minimal error info without stack traces
        console.error(`Error ${status}: ${message}`);
      }
      
      // Never expose internal error details to clients in production
      const responseMessage = process.env.NODE_ENV === 'development' ? message : 'An error occurred';
      res.status(status).json({ message: responseMessage });
      // Don't throw the error again as it will crash the server
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      log("Setting up Vite...");
      try {
        await setupVite(app, server);
        log("Vite setup completed");
      } catch (error) {
        console.error("Vite setup failed:", error);
        throw error;
      }
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    // Use standard listen method for Replit compatibility
    server.listen(port, '0.0.0.0', () => {
      log(`Server is running on port ${port} and listening on all interfaces`);
      console.log('Listen callback completed successfully');
      
      // Verify the server is actually listening
      const address = server.address();
      if (address && typeof address === 'object') {
        console.log(`Server confirmed listening on ${address.address}:${address.port}`);
      }
    });
    
    server.on('error', (error: any) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      }
      process.exit(1);
    });
    
    // Add process event handlers to catch any unexpected exits
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception - Full Stack:', err);
      console.error('Stack trace:', err.stack);
      // Don't exit immediately - log and try to continue
      console.error('Server continuing despite uncaught exception');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit immediately - log and try to continue
      console.error('Server continuing despite unhandled rejection');
    });
    
    console.log('Main function completed, server should be running');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('Received SIGINT, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    // Keep the event loop active
    setInterval(() => {
      // This keeps the process alive
    }, 1000 * 60 * 60); // Check every hour
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
