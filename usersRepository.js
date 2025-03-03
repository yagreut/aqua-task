import jsonfile from "jsonfile";

/**
 * Manages user data storage and retrieval
 */
class UsersRepository {
  constructor() {
    this.userMap = new Map();
    this.nameMap = new Map(); // Secondary index for faster name lookups
  }

  /**
   * Loads users from a JSON file
   * @param {string} filePath - Path to JSON file
   * @param {function} validateUser - Callback to validate each user
   */
  async loadUsers(filePath, validateUser) {
    const users = await jsonfile.readFile(filePath);
    users.forEach((user) => {
      if (validateUser(user)) {
        this.userMap.set(user.id, user);
        this.nameMap.set(user.name, user);
      }
    });
  }

  /**
   * Gets a user by name
   * @param {string} name - User name
   * @returns {object|null} User object or null if not found
   */
  getUserByName(name) {
    return this.nameMap.get(name) || null;
  }

  /**
   * Gets all usernames
   * @returns {string[]} Array of usernames
   */
  getAllUsernames() {
    return Array.from(this.nameMap.keys());
  }

  /**
   * Saves a user
   * @param {object} user - User object to save
   */
  saveUser(user) {
    this.userMap.set(user.id, user);
    this.nameMap.set(user.name, user);
  }
}

export default new UsersRepository();