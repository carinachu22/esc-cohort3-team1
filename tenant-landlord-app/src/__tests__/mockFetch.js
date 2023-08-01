const loginResponse = {
    tenant_user_id: 1,
    email: 'tenant1@gmail.com',
    password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',

    public_building_id: 'RC',
    public_lease_id: '2023-01-01 00:00:00',
    deleted_date: null
  };
  

  
  export default async function mockFetch(url) {
    //mockFetch returns an object that resembles what a fetch call would return in response to API calls
    switch (url) {
      case "http://localhost:5000/api/tenant/login": {
        return {
          ok: true,
          status: 200,
          token: "mocked_token",
          json: async () => loginResponse,
        };
      }
    
      default: {
        throw new Error(`Unhandled request: ${url}`);
      }
    }
  }
  