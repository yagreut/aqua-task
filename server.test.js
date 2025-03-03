import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "./server.js";
import usersRepository from "./usersRepository.js";

describe("User API", () => {
  beforeEach(async () => {
    usersRepository.userMap.clear();
    await usersRepository.loadUsers("users.json", () => true);
  });

  it("GET /users should return all usernames", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(["Alice", "Bob"]);
  });

  it("GET /users/Alice should return Alice’s info", async () => {
    const response = await request(app).get("/users/Alice");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "123456782",
      phone: "0501234567",
      name: "Alice",
      address: "123 Main St",
    });
  });

  it("GET /users/NonExistent should return 404", async () => {
    const response = await request(app).get("/users/NonExistent");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("POST /users with valid data should create a user", async () => {
    const newUser = {
      id: "111111118",
      phone: "0541111111",
      name: "Charlie",
      address: "789 Pine Rd",
    };
    const response = await request(app).post("/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newUser);
  });

  it("POST /users with invalid ID should return 400", async () => {
    const invalidUser = {
      id: "123",
      phone: "0541111111",
      name: "Charlie",
      address: "789 Pine Rd",
    };
    const response = await request(app).post("/users").send(invalidUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid user data" });
  });
});
