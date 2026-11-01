
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { processExpiredExamAttempts } from "./controllers/exam.controller";

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(
      `[SERVER] Remon Academy API running on http://localhost:${env.port}`
    );

    console.log("[EXAM SCHEDULER] Auto-submit scheduler started");

    // Run once immediately after the server starts.
    void processExpiredExamAttempts();

    // Check for expired attempts every 10 seconds.
    setInterval(() => {
      void processExpiredExamAttempts();
    }, 10_000);
  });
}

start().catch((error) => {
  console.error("[SERVER] Failed to start:", error);
  process.exit(1);
});
