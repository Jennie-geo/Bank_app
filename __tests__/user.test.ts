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

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

let id: string;
let accId: string;
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
        id = res.body.Details.User._id;
        const data = res.body;
        expect(data.success).toBe(true);
      });
  });
  let token: string;
  test("test login endpoint", async () => {
    const logUser = {
      email: "odoleemma@gmail.com",
      password: "kay is a good boy!!!",
    };
    await request(app)
      .post("/login")
      .send(logUser)
      .expect(200)
      .expect((res) => {
        token = res.body.token;
        const data = res.body;
        expect(data.message).toBe("Auth successful");
      });
  });

  test("test get all transactions endpoint", async () => {
    const response = await request(app).get("/getTransaction");
    // .set("Authorization");
    expect(response.status).toBe(401);
  });
  test("test get all transactions endpoint", async () => {
    const response = await request(app)
      .get("/getTransaction")
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(200);
  });
  test("test for created account endpoint", async () => {
    const response = await request(app)
      .post("/createAcct")
      .send({
        accountNumber: 12345678,
        amount: 2000,
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for create new account endpoint", async () => {
    const response = await request(app)
      .post("/createAcct")
      .send({
        accountNumber: "2345628345",
        amount: 30000,
      })
      .set("Cookie", `Authorization=${token}`);
    accId = response.body.Account.details._id;
    expect(response.status).toBe(201);
  });

  test("test for create new second account endpoint", async () => {
    const response = await request(app)
      .post("/createAcct")
      .send({
        accountNumber: "2355556245",
        amount: 35000,
      })
      .set("Cookie", `Authorization=${token}`);
    accId = response.body.Account.details._id;
    expect(response.status).toBe(201);
  });

  test("test get singletransactions endpoint with wrong id", async () => {
    const _id = "6130758fe94ddc4ee0ea0d7d";
    const response = await request(app)
      .get(`/getTransaction/${_id}`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for balance of one account endpoint", async () => {
    const response = await request(app)
      .get(`/getTransaction/${accId}`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(200);
  });

  test("test for transferMoney endpoint", async () => {
    const response = await request(app)
      .get(`/transferBalance`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(200);
  });

  test("test for transferMoney endpoint with a wrong accounts", async () => {
    const response = await request(app)
      .post(`/transfer`)
      .send({
        senderAccount_nr: "1234566867",
        amount: 1000,
        receiverAccount_nr: "2322563476",
        transactionDesc: "saves",
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for transferMoney endpoint correct accounts", async () => {
    const response = await request(app)
      .post(`/transfer`)
      .send({
        senderAccount_nr: "2355556245",
        amount: 1000,
        receiverAccount_nr: "2345628345",
        transactionDesc: "saves",
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(200);
  });

  test("test for transferMoney endpoint send account doesn't exists", async () => {
    const response = await request(app)
      .post(`/transfer`)
      .send({
        senderAccount_nr: "2312556245",
        amount: 1000,
        receiverAccount_nr: "2345628345",
        transactionDesc: "saves",
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for transferMoney endpoint reveiver account doesn't exists", async () => {
    const response = await request(app)
      .post(`/transfer`)
      .send({
        senderAccount_nr: "2312556245",
        amount: 1000,
        receiverAccount_nr: "2342628145",
        transactionDesc: "saves",
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for transferMoney endpoint when amount is lesser", async () => {
    const response = await request(app)
      .post(`/transfer`)
      .send({
        senderAccount_nr: "2345628345",
        amount: 100000,
        receiverAccount_nr: "2355556245",
        transactionDesc: "saves",
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for transferMoney endpoint when sender is the same as receiver", async () => {
    const response = await request(app)
      .post(`/transfer`)
      .send({
        senderAccount_nr: "2355556245",
        amount: 100000,
        receiverAccount_nr: "2355556245",
        transactionDesc: "saves",
      })
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for singleBalance endpoint", async () => {
    const _id = "6130758fe94ddc4ee0ea0d7d";
    const response = await request(app)
      .get(`/transferBalance/${_id}`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test for logging out a user endpoint when a user doesn't exists", async () => {
    const response = await request(app)
      .delete(`/account/${id}`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });

  test("test logout endpoint", async () => {
    const response = await request(app)
      .delete("/logout")
      .set("Cookie", `Authorization=${token}`);
    expect(response.statusCode).toBe(200);
  });
});
