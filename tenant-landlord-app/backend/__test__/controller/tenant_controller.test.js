import request from "supertest";
import app from "../../app.js";
import setup from '../setup.js';
import teardown from '../teardown.js';
import jwt from "jsonwebtoken";

async function authorisation() {
  const userData = {
    email: 'tenant1@gmail.com',
    password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS'
  };
  const jsontoken = jwt.sign(userData, "paolom8", { expiresIn: "1h" })
  return jsontoken;
}

beforeAll(async () => { await setup(); });
afterAll(async () => { await teardown(); });

describe ("/tenant/login", () => {
  test("valid email and password credentials", async () =>  {
    await request(app)
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
  })
})

describe ("/tenant/createTicket", () => {
  test("valid and complete inputs", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing name", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing public_service_request_id", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing email", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing request_type", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing request_description", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing quotation_path", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("missing submitted_date_time", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/tenant/createTicket")
      .set("Authorization", `Bearer ${token}`)
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
  })

  test("tenant user with no token", async () =>  {
    await request(app)
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
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!"
          })
        })
  })
})

describe ("/tenant/quotationApproval/:id", () => {
  test("valid ticket id and accept quotation", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/tenant/quotationApproval/2004-04-04 04:04:04")
      .set("Authorization", `Bearer ${token}`)
      .send({ quotation_accepted_by_tenant: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("valid ticket id and reject quotation", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/tenant/quotationApproval/2002-02-02 02:02:02")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quotation_accepted_by_tenant: 0
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("valid ticket id and data validation error", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/tenant/quotationApproval/2005-05-05 05:05:05")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quotation_accepted_by_tenant: 2
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Data validation error"
          })
        })
  })

  test("invalid ticket id", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/tenant/quotationApproval/999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quotation_accepted_by_tenant: 1
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "Failed to update quotation"
          })
        })
  })

  test("tenant user with no token", async () =>  {
    await request(app)
      .patch("/api/tenant/quotationApproval/2005-05-05 05:05:05")
      .send({
        quotation_accepted_by_tenant: 1
      })
      .then((response) => {
        console.log(response)
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})

describe ("/tenant/getTickets", () => {

  test("valid tenant email with service tickets", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTickets")
      .set("Authorization", `Bearer ${token}`)
      .query({ email: "tenant4@gmail.com" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 1,
            data: [{
              service_request_id: 2,
              public_service_request_id: "2003-03-03 03:03:03",
              name: "tenant4",
              email: "tenant4@gmail.com",
              request_type: "aircon",
              request_description: "aircon",
              quotation_path: null,
              submitted_date_time: expect.any(String),
              completed_date_time: null, 
              status: "tenant_ticket_created",
              feedback_rating: null,
              feedback_text: null
            }]
          })
        })
  })

  test("valid tenant email without service tickets", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTickets")
      .set("Authorization", `Bearer ${token}`)
      .query({ email: "tenant2@gmail.com" })
      .expect(200)
      .then((response) => {
          expect(response.body).toEqual({
              success: 1,
              data: []
            })
        })
  })

  test("invalid tenant who is not in tenant_user table", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTickets")
      .set("Authorization", `Bearer ${token}`)
      .query({ email: "wrong@gmail.com" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "User not found"
          })
        })
  })

  test("tenant user with no token", async () =>  {
    await request(app)
      .get("/api/tenant/getTickets")
      .query({
        email: "hacker@gmail.comm"
      })
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})

describe ("/tenant/getTicketsByStatus/:status", () => {

  test("valid tenant email and status with service tickets", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTicketsByStatus/landlord_completed_work")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "tenant5@gmail.com" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          success: "1",
          data: [{
                service_request_id: 5,
                public_service_request_id: "2006-06-06 06:06:06",
                name: "tenant5",
                email: "tenant5@gmail.com",
                request_type: "cleanliness",
                request_description: "not clean",
                quotation_path: ":Content/Documents/quotation_details/q3",
                submitted_date_time: expect.any(String),
                completed_date_time: null, 
                status: "landlord_completed_work",
                feedback_rating: null,
                feedback_text: null
              }]
      })
        })
  })

  test("valid tenant email and status without service tickets", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTicketsByStatus/tenant_ticket_created")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "tenant3@gmail.com" })
      // .expect(200)
      .then((response) => {
          expect(response.body).toEqual({
              success: "1",
              data: []
            })
        })
  })

  test("valid tenant user but invalid status", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTicketsByStatus/invalid_status")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "tenant1@gmail.com" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "invalid status"
          })
        })
  })

  test("valid status but invalid tenant user email", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/tenant/getTicketsByStatus/landlord_completed_work")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "wrong@gmail.com" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "User not found"
          })
        })
  })

  test("tenant user with no token", async () =>  {
    await request(app)
      .get("/api/tenant/getTicketsByStatus/landlord_completed_work")
      .query({
        email: "tenant1@gmail.comm"
      })
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})