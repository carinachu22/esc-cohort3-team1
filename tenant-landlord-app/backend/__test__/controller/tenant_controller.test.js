import request from "supertest";
import app from "../../app.js";
import setup from '../setup.js';
import teardown from '../teardown.js';
import assert from "assert";

beforeAll(async () => {
    await setup();
});
afterAll(async () => {
    await teardown();
});

describe ("/tenant/login", () => {
  test("valid email and password credentials", () =>  {
    return request(app)
      .post("/api/tenant/login")
      .send({
        email: 'tenant1@gmail.com',
        password: 'password'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          success: 1, 
          message: "Login successfully",
          token: expect.any(String)
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("invalid email", async () => {
    await request(app)
      .post("/api/tenant/login")
      .send({
        email: "wrong@gmail.com", 
        password: "password"
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          success: 0,
          data: "Invalid email or password"
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("invalid password", async () => {
    await request(app)
      .post("/api/tenant/login")
      .send({
        email: "tenant2@gmail.com", 
        password: "wrong_password"
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          success: 0,
          data: "Invalid email or password"
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
})