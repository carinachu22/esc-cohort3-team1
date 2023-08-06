import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import Dashboard from "../pages/Dashboard.js";
// Mock specific hooks from react-auth-kit
jest.mock("react-auth-kit", () => {
  const originalModule = jest.requireActual("react-auth-kit");
  return {
    ...originalModule,
    useAuthUser: () => () => ({
      email: "tenant1@gmail.com",
      type: "tenant",
    }),
    useAuthHeader: () =>
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiO…zNTV9.7Y9-rpf8Mn1GeeUpvAdqG4jj6RVwfcqCri7x-qjZOwM",
    useIsAuthenticated: () => () => true,
  };
});
test("Renders Dashboard", () => {
  render(
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthProvider>
  );
  const heading = screen.getByText("Service Ticket Portal");
  expect(heading).toBeInTheDocument();
});
