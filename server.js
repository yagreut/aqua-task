import express from "express";
import usersService from "./usersService.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "1kb" })); // Security: Limit payload size

// Mount users service routes at /users
app.use("/users", usersService.router);

// Start server only after initialization
async function startServer() {
  console.log("Starting server...");
  try {
    await usersService.initialize();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer();
}

export default app;
