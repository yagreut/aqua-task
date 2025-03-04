import express from "express";
import usersRepository from "./usersRepository.js";
import { isValidIsraeliID, isValidPhone } from "./utils.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const USERS_FILE_PATH = process.env.USERS_FILE_PATH || "users.json";

class UsersService {
  constructor() {
    this.repository = usersRepository;
    this.router = express.Router();

    // Define routes
    this.router.get("/", this.handleGetAllUsers.bind(this));
    this.router.get("/:name", this.handleGetUserByName.bind(this));
    this.router.post("/", this.handleCreateUser.bind(this));
  }

  async initialize() {
    await this.repository.loadUsers(
      USERS_FILE_PATH,
      this.validateUser.bind(this)
    );
  }

  validateUser(user) {
    const errors = [];
    if (!user.id || !user.phone || !user.name || !user.address) {
      errors.push("Missing required fields");
    }
    if (!isValidIsraeliID(user.id)) {
      errors.push("Invalid Israeli ID");
    }
    if (!isValidPhone(user.phone)) {
      errors.push("Invalid phone number");
    }
    if (errors.length > 0) {
      console.log(
        `Invalid user: ${user.name || "Unknown"} - ${errors.join(", ")}`
      );
      return { isValid: false, errors };
    }
    return { isValid: true, errors: [] };
  }

  handleGetAllUsers(req, res) {
    const usernames = this.repository.getAllUsernames();
    res.json(usernames);
  }

  handleGetUserByName(req, res) {
    const user = this.repository.getUserByName(req.params.name);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }

  handleCreateUser(req, res) {
    const user = req.body;
    const validation = this.validateUser(user);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    this.repository.saveUser(user); // Overwrites if name exists
    res.status(201).json(user);
  }
}

export default new UsersService();
