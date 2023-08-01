import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";

import LoginPage from "../pages/LoginPage.js";
import Dashboard from "../pages/Dashboard.js"

describe("Login.js", () => {
  test("Email,Password, login btn features are present", () => {
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
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: "LOGIN" });
    expect(submitBtn).toBeInTheDocument();
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
  });

  test("Successful tenant login", async () => {
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
    // TODO: Mock API calls, go to navigateDashboard page
  });
  test("Invalid email/Password", async () => {
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
    //Mock API calls, check values and call error
  });
});

/** Extra tests
 * - Data validation of email/password
 */
