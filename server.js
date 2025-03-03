import express from "express";
import usersService from "./usersService.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "1kb" })); // Security: Limit payload size

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", initialized: usersService.isInitialized() });
});

app.get("/users", (req, res) => {
  const usernames = usersService.getAllUsernames();
  res.json(usernames);
});

app.get("/users/:name", (req, res) => {
  const user = usersService.getUserByName(req.params.name);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/users", (req, res) => {
  const result = usersService.createUser(req.body);
  if (result.success) {
    res.status(201).json(result.user);
  } else {
    res.status(400).json({ errors: result.errors });
  }
});

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
