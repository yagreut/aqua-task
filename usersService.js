import usersRepository from "./usersRepository.js";

class UsersService {
  constructor() {
    this.repository = usersRepository;
  }

  async initialize() {
    await this.repository.loadUsers("users.json", this.validateUser.bind(this));
  }

  validateUser(user) {
    if (!user.id || !user.phone || !user.name || !user.address) {
      console.log(`Invalid user: ${user.name || "Unknown"} - Missing fields`);
      return false;
    }
    if (!this.isValidIsraeliID(user.id)) {
      console.log(`Invalid user: ${user.name} - Invalid ID`);
      return false;
    }
    if (!this.isValidPhone(user.phone)) {
      console.log(`Invalid user: ${user.name} - Invalid phone`);
      return false;
    }
    return true;
  }

  isValidIsraeliID(id) {
    if (!/^\d{9}$/.test(id)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(id[i]) * ((i % 2) + 1);
      sum += digit > 9 ? digit - 9 : digit;
    }
    return sum % 10 === 0;
  }

  isValidPhone(phone) {
    return /^05[0-9]{8}$/.test(phone);
  }

  getAllUsernames() {
    return this.repository.getAllUsernames();
  }

  getUserByName(name) {
    return this.repository.getUserByName(name);
  }

  createUser(user) {
    if (!this.validateUser(user)) {
      return { success: false, error: "Invalid user data" };
    }
    this.repository.saveUser(user);
    return { success: true, user };
  }
}

export default new UsersService();
