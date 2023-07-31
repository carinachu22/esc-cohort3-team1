import React from "react";
import { render, screen } from "@testing-library/react";
import FirstTest from "../component_test/FirstTest.js";
//import CreateTicketPage from "../pages/CreateTicketPage";
import { BrowserRouter } from "react-router-dom";
import App from "../pages/App.js";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider, useSignIn } from "react-auth-kit";
import LoginPage from "../pages/LoginPage.js";

// Mock react-router-dom before rendering the component
jest.mock("react-router-dom");

describe("Level 0: Rendering pages", () => {
  test("Testing the set up file", () => {
    render(<FirstTest />);

    const element = screen.getByText(/first test/i);

    expect(element).toBeInTheDocument();
  });

  test("Render App.js", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});

/** Login Page first  */
describe("Level 1: Rendering pages", () => {
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
});

//async function setup() {
//SignIn
// 1. Specify values, username, password
// 2. API call w defined values
// 3. Sign in using react auth kit

//}
