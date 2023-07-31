import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import App from "../pages/App.js";
import "@testing-library/jest-dom";
//import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider, useSignIn } from "react-auth-kit";
import LoginPage from "../pages/LoginPage.js";

// Mock react-router-dom before rendering the component
jest.mock("react-router-dom");
jest.mock("react-auth-kit");

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
describe("LoginPage.js", () => {
  test("Render Login Page", () => {
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
  });

  test("Email Input box is rendered", async () => {
    await render(
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
    screen.getByTestId("login-email");
    screen.debug();
    //const emailInput = screen.getByLabelText("email");
    //expect(emailInput).toBeInTheDocument();
  });
});
