import request from "supertest";
import app from "../../app.js";
import setup from '../setup.js';
import teardown from '../teardown.js';
import jwt from "jsonwebtoken";


/**
 * Mock authorisation
 * @returns token after authentication
 */
async function authorisation() {
  const userData = {
    email: 'landlord1@gmail.com',
    password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS'
  };
  const jsontoken = jwt.sign(userData, "qwe1234", { expiresIn: "1h" })
  return jsontoken;
}

/**
 * Setting up and tearing down of database
 */
beforeAll(async () => { await setup(); });
afterAll(async () => { await teardown(); });

/**
 * Test landlord login API
 */
describe ("/landlord/login", () => {
    test("valid email and password credentials", async () =>  {
      await request(app)
        .post("/api/landlord/login")
        .send({
          email: 'landlord1@gmail.com',
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
        .post("/api/landlord/login")
        .send({
          email: "wrong@gmail.com", 
          password: "password"
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            success: 0,
            message: "Invalid email or password"
          })
        })
    })
  
    test("invalid password", async () => {
      await request(app)
        .post("/api/landlord/login")
        .send({
          email: "tenant2@gmail.com", 
          password: "wrong_password"
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            success: 0,
            message: "Invalid email or password"
          })
        })
    })
  })

  /**
   * Test landlord create landlord account API
   */
describe ("/landlord/create", () => {
  test("non-existing landlord, valid inputs", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "landlord8@gmail.com",
        password: "password",
        ticket_type: "cleanliness"
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
           success: 1, 
           message: "created successfully",
           data: expect.objectContaining({
                  fieldCount: 0,
                 affectedRows: 1,
                 insertId: expect.any(Number),
                 info: "",
                 serverStatus: expect.any(Number),
                 warningStatus: 0
            })
        });
     })
  })

  test("non-existing landlord, no ticket_type", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "landlord7@gmail.com",
        password: "password"
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
           success: 1, 
           message: "created successfully",
           data: expect.objectContaining({
                  fieldCount: 0,
                 affectedRows: 1,
                 insertId: expect.any(Number),
                 info: "",
                 serverStatus: expect.any(Number),
                 warningStatus: 0
            })
        });
     })
  })

  test("landlord exists in database", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "landlord2@gmail.com",
        password: "password",
        ticket_type: "cleanliness"
      })
      .expect('Content-Type', /json/)
      .expect(500)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "duplicate email",
            })
      });
  })

  test("missing email", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "password",
        ticket_type: "cleanliness"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "missing data entry!",
            })
      });
  })

  test("missing password", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "landlord6@gmail.com",
        ticket_type: "cleanliness"
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "missing data entry!",
            })
      });
  })

  test("landlord user with no token", async () =>  {
    await request(app)
      .post("/api/landlord/create")
      .send({
        email: "landlord8@gmail.com",
        password: "password",
        ticket_type: "cleanliness"
      })
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})

/**
 * Test landlord create tenant account API
 */
describe("/landlord/createTenant", () => {
  test("non-existing landlord, valid inputs", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/createTenant")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: 'tenant12@gmail.com',
        password: 'password',
        landlordEmail: 'landlord2@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
           success: 1, 
           message: "created successfully",
           data: expect.objectContaining({
                  fieldCount: 0,
                 affectedRows: 1,
                 insertId: expect.any(Number),
                 info: "",
                 serverStatus: expect.any(Number),
                 warningStatus: 0
            })
        });
     })
  })

  test("existing active tenant", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/createTenant")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: 'tenant6@gmail.com',
        password: 'password',
        landlordEmail: 'landlord2@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "Duplicate email entry",
            data: expect.arrayContaining([
              {
                deleted_date: null,
                email: "tenant6@gmail.com",
                password: "$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS",
                public_building_id: "RC",
                public_lease_id: "2003-10-30 11:11:11",
                tenant_user_id: 6
              }
            ])
        });
      })
  })

  test("existing deleted tenant (account recovery test)", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/createTenant")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: 'tenant7@gmail.com',
        password: 'password',
        landlordEmail: 'landlord2@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "Duplicate email entry",
            data:  expect.arrayContaining([
              {
                deleted_date: null,
                email: "tenant7@gmail.com",
                password: "$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS",
                public_building_id: "TM1",
                public_lease_id: "2017-11-20 17:16:15",
                tenant_user_id: 7
              }
            ])
        });
      })
  })

  test("missing tenant email", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/createTenant")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: 'password',
        landlordEmail: 'landlord2@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "missing data entry!",
          })
      });
  })

  test("missing password", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/createTenant")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: 'tenant12@gmail.com',
        landlordEmail: 'landlord2@gmail.com'
      })
      .then((response) => {
        expect(response.body).toEqual({
           success: 0, 
           message: "missing data entry!",
        })
    });
  })

  test("missing landlord email", async () =>  {
    const token = await authorisation()
    await request(app)
      .post("/api/landlord/createTenant")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: 'tenant12@gmail.com',
        password: 'password'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
         expect(response.body).toEqual({
            success: 0, 
            message: "missing data entry!",
          })
      });
    })

  test("unauthorised landlord", async () =>  {
    await request(app)
      .post("/api/landlord/createTenant")
      .send({
        email: 'tenant12@gmail.com',
        password: 'password',
        landlordEmail: 'landlord2@gmail.com'
      })
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
});

/**
 * Test landlord getting lease details API
 */
describe("/landlord/getLeaseDetails/", () => {
  test("valid user id", async () => {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getLeaseDetails")
      .set("Authorization", `Bearer ${token}`)
      .query({
        id: 2
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1, 
            message: "successfully retrieve lease details",
            data: expect.objectContaining(
              {
                lease_id: 2,
                public_lease_id: "2001-02-16 12:01:09",
                tenant_user_id: 2,
                landlord_user_id: 1,
                floor: "02",
                unit_number: "894",
                pdf_path: ":Content/Documents/lease_details/2"
              }
            )
        });
      })
  })

  test("invalid user id", async () => {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getLeaseDetails")
      .set("Authorization", `Bearer ${token}`)
      .query({
        id: 999
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1, 
            message: "successfully retrieve lease details",
            data: expect.objectContaining(
              {}
            )
        });
      })
  })

  test("unauthorised landlord", async () =>  {
    await request(app)
      .get("/api/landlord/getLeaseDetails")
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})

/**
 * Test landlord delete lease API
 */
describe("/landlord/deleteLease/", () => {
  test("valid public lease id", async () => {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/deleteLease")
      .set("Authorization", `Bearer ${token}`)
      .send({
        public_lease_id: "2014-01-20 17:16:15"
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1, 
            message: "deleted successfully"
        });
      })
  })

  test("invalid public lease id", async () => {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/deleteLease")
      .set("Authorization", `Bearer ${token}`)
      .send({
        public_lease_id: "9999-99-99 99:99:99"
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            success: 1, 
            message: "deleted successfully"
        });
      })
  })

  test("missing public lease id", async () => {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/deleteLease")
      .set("Authorization", `Bearer ${token}`)
      .send({
        public_lease_id: null
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0, 
            message: "missing data entry!"
        });
      })
  })

  test("unauthorised landlord", async () => {
    await request(app)
      .patch("/api/landlord/deleteLease")
      .send({ public_lease_id: "2014-01-20 17:16:15" })
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})

/**
 * Test landlord get tickets API
 */
describe ("/landlord/getTickets", () => {

  test("authorised landlord", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTickets")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: "1",
            data: expect.any(Array)
          })
        })
  })

  test("unauthorised landlord", async () =>  {
    await request(app)
      .get("/api/landlord/getTickets")
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

/**
 * Test landlord get ticket by public ticket id API
 */
describe ("/landlord/getTicketById", () => {

  test("valid ticket id", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTicketById")
      .set("Authorization", `Bearer ${token}`)
      .query({ id: "SR/2003/Mar/0001" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          success: "1",
          data: {
            service_request_id: 2,
            public_service_request_id: 'SR/2003/Mar/0001',
            email: 'tenant4@gmail.com',
            request_type: 'aircon',
            request_description: 'aircon',
            submitted_date_time: "2003-03-02T19:03:03.000Z",
            completed_date_time: null,
            status: 'tenant_ticket_created',
            feedback_rating: null,
            feedback_text: null,
            quotation_path: null,
            service_requestcol: null,
            floor: '10',
            unit_number: '30',
            quotation_required: null
          }
        })
      })
    })

  test("invalid ticket id", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTicketById")
      .set("Authorization", `Bearer ${token}`)
      .query({ id: "SR/9999/999/9999" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          success: 0,
          message: "Record not found"
        })
      })
  })

  test("unauthorised landlord", async () =>  {
    await request(app)
      .get("/api/landlord/getTicketById")
      .query({ id: "SR/2003/Mar/0001" })
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
    })
})

/**
 * Test landlord get ticket by ticket status API
 */
describe ("/landlord/getTicketsByStatus/:status", () => {

  test("valid status with service tickets", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTicketsByStatus/landlord_completed_work")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          success: "1",
          data: [{
                service_request_id: 3,
                public_service_request_id: "SR/2004/Apr/0001",
                email: "tenant1@gmail.com",
                request_type: "cleanliness",
                request_description: "not clean",
                quotation_path: ":Content/Documents/quotation_details/q2",
                submitted_date_time: expect.any(String),
                completed_date_time: null, 
                status: "landlord_completed_work",
                feedback_rating: null,
                feedback_text: null,
                floor: '9',
                unit_number: '154',
                quotation_required: null
              }, {
                service_request_id: 5,
                public_service_request_id: "SR/2006/Jun/0001",
                email: "tenant5@gmail.com",
                request_type: "cleanliness",
                request_description: "not clean",
                quotation_path: ":Content/Documents/quotation_details/q3",
                submitted_date_time: expect.any(String),
                completed_date_time: null, 
                status: "landlord_completed_work",
                feedback_rating: null,
                feedback_text: null,
                floor: '6',
                unit_number: '100',
                quotation_required: null
              }]
          })
      })
  })

  test("status without service tickets", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTicketsByStatus/landlord_ticket_rejected")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
          expect(response.body).toEqual({
              success: 0,
              message: "Record not found"
            })
        })
  })

  test("invalid status", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTicketsByStatus/invalid_status")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toEqual({
            success: 0,
            message: "invalid status"
          })
        })
  })

  test("unauthorised landlord", async () =>  {
    await request(app)
      .get("/api/landlord/getTicketsByStatus/landlord_completed_work")
      .then((response) => {
        expect(JSON.parse(response.text)).toEqual({
            success: 0,
            message: "Access denied: You are unauthorized!",
          })
        })
  })
})

/**
 * Test landlord approving ticket API
 */
describe ("/landlord/ticketApproval", () => {
  test("valid approval inputs: approved and need quotation", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketApproval")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        quotation_required: 1,
        ticket_approved_by_landlord: 1 
      })
      // .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("valid approval inputs: approved and do not need quotation", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketApproval")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        quotation_required: 0,
        ticket_approved_by_landlord: 1 
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("valid approval inputs: reject", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketApproval")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        quotation_required: 0,
        ticket_approved_by_landlord: 0 
      })
      .expect(200)
      .then((response) => {
        console.log(response.body)
        expect(response.body).toMatchObject({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("invalid approval inputs: ticket_approved_by_landlord = 2", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketApproval")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        quotation_required: 1,
        ticket_approved_by_landlord: 2 
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "Data validation error"
          })
        })
  })

  test("missing data entry", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketApproval")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        ticket_approved_by_landlord: 1 
      })
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "missing data entry!"
          })
        })
  })

  test("invalid ticket id", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketApproval")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/9999/999/9999",
        quotation_required: 1,
        ticket_approved_by_landlord: 1 
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "Failed to update user"
          })
        })
  })
})

/**
 * Test landlord starting/completing work on ticket API
 */
describe ("/landlord/ticketWork", () => {
  test("valid inputs: starting work", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketWork")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        ticket_work_status: 1,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("valid inputs: completed work", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketWork")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        ticket_work_status: 0,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 1,
            data: "updated successfully"
          })
        })
  })

  test("invalid work inputs: ticket_work_status = 2", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketWork")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/2004/Apr/0001",
        ticket_work_status: 2 
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "Data validation error"
          })
        })
  })

  test("missing data entry", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketWork")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_work_status: 1 
      })
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "missing data entry!"
          })
        })
  })

  test("invalid ticket id", async () =>  {
    const token = await authorisation()
    await request(app)
      .patch("/api/landlord/ticketWork")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        ticket_id: "SR/9999/999/9999",
        ticket_work_status: 1,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "Failed to update user"
          })
        })
  })
})

/**
 * Test landlord get tenant accounts API
 */
describe ("/landlord/getTenantAccounts", () => {

  test("authorised landlord with valid email", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTenantAccounts")
      .set("Authorization", `Bearer ${token}`)
      .query({landlordEmail: "landlord2@gmail.com"})
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: "1",
            data: expect.any(Array)
          })
        })
  })

  test("authorised landlord with invalid email", async () =>  {
    const token = await authorisation()
    await request(app)
      .get("/api/landlord/getTenantAccounts")
      .set("Authorization", `Bearer ${token}`)
      .query({landlordEmail: "landlord999@gmail.com"})
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
            success: 0,
            message: "invalid landlord email"
          })
        })
  })
})