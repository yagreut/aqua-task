import jsonfile from "jsonfile";

class UsersRepository {
  constructor() {
    this.userMap = new Map();
  }

  /**
   * Loads users from a JSON file
   * @param {string} filePath - Path to JSON file
   * @param {function} validateUser - Callback to validate each user
   */
  async loadUsers(filePath, validateUser) {
    try {
      const users = await jsonfile.readFile(filePath);
      users.forEach((user) => {
        if (validateUser(user)) {
          this.userMap.set(user.id, user);
        }
      });
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }

  getUserByName(name) {
    return (
      Array.from(this.userMap.values()).find((user) => user.name === name) ||
      null
    );
  }

  getAllUsernames() {
    return Array.from(this.userMap.values()).map((user) => user.name);
  }

  saveUser(user) {
    this.userMap.set(user.id, user);
  }
}

export default new UsersRepository();
