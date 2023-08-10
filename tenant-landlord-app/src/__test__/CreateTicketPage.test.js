import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import CreateTicketPage from "../pages/CreateTicketPage.js";
import { fireEvent } from "@testing-library/react";

// Mock specific hooks from react-auth-kit
jest.mock("react-auth-kit", () => {
  const originalModule = jest.requireActual("react-auth-kit");
  return {
    ...originalModule,
    useAuthUser: () => () => ({
      email: "tenant1@gmail.com",
      type: "tenant",
    }),
    useAuthHeader: () => () =>
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiO…zNTV9.7Y9-rpf8Mn1GeeUpvAdqG4jj6RVwfcqCri7x-qjZOwM",
    useIsAuthenticated: () => () => true,
  };
});
describe("CreateTicketPage.js", () => {
  test("Renders Create Ticket Page interactive input boxes and button", () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <CreateTicketPage />
        </BrowserRouter>
      </AuthProvider>
    );
    const heading = screen.getByText("Create A Service Ticket");
    expect(heading).toBeInTheDocument();

    const request_type = screen.getByRole("heading", { name: "Request Type" });
    expect(request_type).toBeInTheDocument();

    const description = screen.getByPlaceholderText("Enter your comment");
    expect(description).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    expect(submitBtn).toBeInTheDocument();
  });
  test("Input boxes and button are present", () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <CreateTicketPage />
        </BrowserRouter>
      </AuthProvider>
    );
    const heading = screen.getByText("Create A Service Ticket");
    expect(heading).toBeInTheDocument();

    const request_type = screen.getByRole("heading", { name: "Request Type" });
    expect(request_type).toBeInTheDocument();

    const description = screen.getByPlaceholderText("Enter your comment");
    expect(description).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    expect(submitBtn).toBeInTheDocument();
  });
  test("Fill up Description textbox", async () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <CreateTicketPage />
        </BrowserRouter>
      </AuthProvider>
    );
    const heading = screen.getByText("Create A Service Ticket");
    expect(heading).toBeInTheDocument();

    const description = screen.getByPlaceholderText("Enter your comment");
    expect(description).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText("Enter your comment"),
      "aircon spoil"
    );
    expect(screen.getByPlaceholderText("Enter your comment")).toHaveValue(
      "aircon spoil"
    );
  });
  test("Click Submit Button", async () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <CreateTicketPage />
        </BrowserRouter>
      </AuthProvider>
    );
    const heading = screen.getByText("Create A Service Ticket");
    expect(heading).toBeInTheDocument();
    //Click handler of submitBtn
    const submitBtn = screen.queryByRole("button", { name: "Submit" });
    await userEvent.click(submitBtn);
  });
  test("Select Request type from dropdown", async () => {
    render(
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <CreateTicketPage />
        </BrowserRouter>
      </AuthProvider>
    );
    // Find the select input by its role attribute
    const selectInput = screen.getByRole("combobox");
    // Trigger change event to select an option
    fireEvent.change(selectInput, { target: { value: "Cleanliness" } });
    // Verify that the selected option has been applied to the select input
    expect(selectInput).toHaveValue("Cleanliness");
  });
});
