import express from "express";
import usersService from "./usersService.js";
import { fileURLToPath } from "url";

const app = express();
console.log("Starting server...");

app.use(express.json());

usersService.initialize().catch(console.error);

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
    res.status(400).json({ error: result.error });
  }
});

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

export default app;
