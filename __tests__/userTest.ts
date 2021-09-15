import request from "supertest";
import app from "../src/app";
import dbHandler from "../Memory_server/memoryServer";

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

describe("Test User Endpoints", () => {
  test("test signup endpoint", async () => {
    const newUser = {
      firstName: "Kayode",
      lastName: "Odole",
      email: "odoleemma@gmail.com",
      password: "kay is a good boy!!!",
    };

    await request(app)
      .post("/signup")
      .send(newUser)
      .expect(201)
      .expect((res) => {
        const data = res.body;
        expect(data.success).toBe("true");
      });
  });
});
