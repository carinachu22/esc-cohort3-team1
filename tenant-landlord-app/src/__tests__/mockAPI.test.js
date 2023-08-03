// Refer to this file on how to mock axios API calls
// The test passes

import axios, { AxiosError } from "axios";

jest.mock("axios");

test("API to login is successful", async () => {
  const resp_data = [
    {
      tenant_user_id: 38,
      email: "tenant1@gmail.com",
      password: "$2b$10$muetmRj1fDH.93XKBFt2yO.GMeLlDJLzB5fniGDLb/0lRNLjzb80y",
      public_building_id: "RC",
      public_lease_id: "1690926182158",
      deleted_date: null,
    },
  ];
  const resp = { data: resp_data };
  const values = {
    email: "tenant1@gmail.com",
    hasError: false,
    password: "password",
  };
  axios.post.mockResolvedValue(resp);

  const result = await axios.post(
    //api to be added
    "http://localhost:5000/api/tenant/login",
    values
  );
  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost:5000/api/tenant/login",
    values
  );
  expect(result).toEqual(resp);
});
