import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import App from "../pages/App.js";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import LoginPage from "../pages/LoginPage.js";

// Mock react-router-dom before rendering the component
//jest.mock("react-router-dom");
//jest.mock("react-auth-kit"); //somehow this causes bugs

describe("App.js", () => {
  test("Render App.js", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});

/** Login Page first  */
describe("Login.js", () => {
  test("renders email input field-Placeholder Text", () => {
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
  });
});
