# Aqua Assignment 🚀

A RESTful user management server built with Node.js.

## 📌 Features

- Load users from a JSON file into a Map
- Retrieve all usernames (`GET /users`)
- Retrieve user info by name (`GET /users/:name`)
- Create new users with validation (`POST /users`)
- Validates Israeli IDs and phone numbers

## 🛠️ Setup (Linux)

Follow these steps to get the server up and running:

### 1️⃣ Prerequisites

Ensure you have **Node.js** and **npm** installed. If not, install them using:

```bash
sudo apt install nodejs npm
```

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/yagreut/aqua-task
cd aqua-task
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Start the Server

```bash
npm start
```

### 5️⃣ Run Tests

```bash
npm test
```

## 📄 API Endpoints

| Method | Endpoint       | Description                                                          |
| ------ | -------------- | -------------------------------------------------------------------- |
| GET    | `/users`       | Returns a list of usernames                                          |
| GET    | `/users/:name` | Returns user details by name                                         |
| POST   | `/users`       | Creates a new user (expects JSON body with id, phone, name, address) |

## 📌 Environment Variables

Create a `.env` file in the root directory and configure necessary environment variables:

```env
PORT=3000
USERS_FILE_PATH=users.json
```

## 🏗️ Technologies Used

- **Node.js** – Backend runtime
- **Express.js** – Web framework

---

🔹 Happy Coding! 🚀
