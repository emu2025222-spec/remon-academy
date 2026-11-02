import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { processExpiredExamAttempts } from "./controllers/exam.controller";

async function start() {
  // Connect to MongoDB before accepting API requests.
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(
      `[SERVER] Remon Academy API running on port ${env.port}`
    );

    console.log("[SERVER] Ready to accept requests");
    console.log("[EXAM SCHEDULER] Auto-submit scheduler started");

    // Run once after the server starts.
    void processExpiredExamAttempts();

    // Check expired attempts every 15 seconds.
    // The controller already prevents overlapping executions.
    const scheduler = setInterval(() => {
      void processExpiredExamAttempts();
    }, 15_000);

    // Do not keep the Node.js process alive only because of this timer.
    scheduler.unref();
  });

  server.on("error", (error) => {
    console.error("[SERVER] HTTP server error:", error);
  });

  process.on("SIGTERM", () => {
    console.log("[SERVER] SIGTERM received. Closing server...");

    server.close(() => {
      console.log("[SERVER] HTTP server closed");
      void import("mongoose").then(({ default: mongoose }) =>
        mongoose.disconnect()
      );
    });
  });

  process.on("SIGINT", () => {
    console.log("[SERVER] SIGINT received. Closing server...");

    server.close(() => {
      console.log("[SERVER] HTTP server closed");
      void import("mongoose").then(({ default: mongoose }) =>
        mongoose.disconnect()
      );
    });
  });
}

start().catch((error) => {
  console.error("[SERVER] Failed to start:", error);
  process.exit(1);
});