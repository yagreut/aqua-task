import usersRepository from "./usersRepository.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const USERS_FILE_PATH = process.env.USERS_FILE_PATH || "users.json";

class UsersService {
  constructor() {
    this.repository = usersRepository;
    this.initialized = false;
  }

  async initialize() {
    await this.repository.loadUsers(
      USERS_FILE_PATH,
      this.validateUser.bind(this)
    );
    this.initialized = true;
  }

  isInitialized() {
    return this.initialized;
  }

  /**
   * Validates a user object
   * @param {object} user - User to validate
   * @returns {{isValid: boolean, errors: string[]}} Validation result
   */
  validateUser(user) {
    const errors = [];
    if (!user.id || !user.phone || !user.name || !user.address) {
      errors.push("Missing required fields");
    }
    if (!this.isValidIsraeliID(user.id)) {
      errors.push("Invalid Israeli ID");
    }
    if (!this.isValidPhone(user.phone)) {
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

  /**
   * Checks if an ID is a valid Israeli ID
   * @param {string} id - ID to check
   * @returns {boolean}
   */
  isValidIsraeliID(id) {
    const cleanId = id.replace(/\D/g, ""); // Remove non-digits
    if (!/^\d{9}$/.test(cleanId)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(cleanId[i]) * ((i % 2) + 1);
      sum += digit > 9 ? digit - 9 : digit;
    }
    return sum % 10 === 0;
  }

  /**
   * Checks if a phone number is valid (Israeli mobile)
   * @param {string} phone - Phone number to check
   * @returns {boolean}
   */
  isValidPhone(phone) {
    const validPrefixes = [
      "050",
      "052",
      "053",
      "054",
      "057",
      "058",
      "059",
      "077",
    ];
    return (
      /^05[0-9]{8}$/.test(phone) && validPrefixes.includes(phone.slice(0, 3))
    );
  }

  getAllUsernames() {
    return this.repository.getAllUsernames();
  }

  getUserByName(name) {
    return this.repository.getUserByName(name);
  }

  /**
   * Creates a new user, overwriting any existing user with the same name
   * @param {object} user - User data
   * @returns {{success: boolean, user?: object, errors?: string[]}}
   */
  createUser(user) {
    const validation = this.validateUser(user);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    this.repository.saveUser(user); // Overwrites if name exists
    return { success: true, user };
  }
}

export default new UsersService();
