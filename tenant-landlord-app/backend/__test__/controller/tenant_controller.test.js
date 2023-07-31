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

describe ("/tenant/createTicket", () => {
  test("valid and complete inputs", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        name: "tenant1",
        email: "tenant1@gmail.com",
        request_type: "cleanliness",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        quotation_path: "C:Downlods/Quotations/q6",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1,
            data: expect.objectContaining({
                  fieldCount: 0,
                  affectedRows: 1,
                  insertId: expect.any(Number),
                  info: "",
                  serverStatus: 2,
                  warningStatus: 0
            })
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing name", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        email: "tenant1@gmail.com",
        request_type: "cleanliness",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        quotation_path: "C:Downlods/Quotations/q6",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing public_service_request_id", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        name: "tenant1",
        email: "tenant1@gmail.com",
        request_type: "cleanliness",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        quotation_path: "C:Downlods/Quotations/q6",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing email", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        name: "tenant1",
        request_type: "cleanliness",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        quotation_path: "C:Downlods/Quotations/q6",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing request_type", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        name: "tenant1",
        email: "tenant1@gmail.com",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        quotation_path: "C:Downlods/Quotations/q6",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing request_description", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        name: "tenant1",
        email: "tenant1@gmail.com",
        request_type: "cleanliness",
        quotation_path: "C:Downlods/Quotations/q6",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing quotation_path", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        name: "tenant1",
        email: "tenant1@gmail.com",
        request_type: "cleanliness",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        submitted_date_time: "2023-06-04 10:10:10"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })

  test("missing submitted_date_time", () =>  {
    return request(app)
      .post("/api/tenant/createTicket")
      .send({
        public_service_request_id: "2023-06-04 10:10:10", 
        name: "tenant1",
        email: "tenant1@gmail.com",
        request_type: "cleanliness",
        request_description: "the toilets are very dirty at level 2. please get someone to clean it.",
        quotation_path: "C:Downlods/Quotations/q6"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Incomplete data fields"
          })
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
})

