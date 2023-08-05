import request from "supertest";
import app from "../../app.js";
import setup from '../setup.js';
import teardown from '../teardown.js';
import jwt from "jsonwebtoken";

async function authorisation() {
  const userData = {
    email: 'landlord1@gmail.com',
    password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS'
  };
  const jsontoken = jwt.sign(userData, "qwe1234", { expiresIn: "1h" })
  return jsontoken;
}

beforeAll(async () => { await setup(); });
afterAll(async () => { await teardown(); });

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
})

describe.only("/landlord/createTenant", () => {
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
});

//TODO: uploadLease

//TODO: getLease

//TODO: createLease

//TODO: getLeaseDetails

//TODO: deleteLease

//TODO: getTickets

//TODO: getTicketsById

//TODO: getTicketsByStatus/:status

//TODO: getQuotation

//TODO: uploadQuotation

//TODO: ticketApproval

//TODO: ticketWork

//TODO: getTenantAccounts

//TODO: deleteAllTenants

//TODO: deleteTenantByEmail

//TODO: forgot-password

//TODO: reset-password/:id/:jsontoken

//TODO: reset-password/:id/:jsontoken