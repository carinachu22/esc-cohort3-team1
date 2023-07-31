import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../pages/App.js";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider, useSignIn } from "react-auth-kit";
import LoginPage from "../pages/LoginPage.js";
import TicketList from "../pages/TicketList.js";
import ViewTicketPage from "../pages/ViewTicketPage.js";

// Mock react-router-dom before rendering the component
jest.mock("react-router-dom");
jest.mock("react-auth-kit");
describe("Level 2: Rendering pages that requires being logged in", () => {
  test("Render Ticket List", () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <TicketList />
        </BrowserRouter>
      </AuthProvider>
    );
  });
  test("Render ViewTicketPage", () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <ViewTicketPage />
        </BrowserRouter>
      </AuthProvider>
    );
  });
});
