import React from "react";
//import { render, screen } from "@testing-library/react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import TicketList from "../pages/TicketList.js";
import ViewTicketPage from "../pages/ViewTicketPage.js";
import Dashboard from "../pages/Dashboard.js";
// Mock react-router-dom before rendering the component
//jest.mock("react-router-dom");
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
test("Render Dashboard", () => {
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
});

