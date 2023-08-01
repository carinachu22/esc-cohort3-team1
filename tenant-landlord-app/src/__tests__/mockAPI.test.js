import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import LoginPage from "../pages/LoginPage.js";

// Create a new instance of the mock adapter
const mock = new MockAdapter(axios);

// Mock the login API call with a custom response
mock.onPost('http://localhost:5000/api/tenant/login').reply(200, {
  token: 'mocked-token',
  user: {
    id: 123,
    email: 'testuser',
    // Add other properties as needed based on your response structure
  },
});
test("Submit button click handler called", async () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "LOGIN" }));

    //Check if Mock API call has run successfully 
    // Check if the API call was made
    await waitFor(() => {
    expect(mock.history.post.length).toBe(1);
  });
  });