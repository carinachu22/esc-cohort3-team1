import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import LoginPage from "../pages/LoginPage.js";

// In your test file - if we dont use the __mocks__ folder
/**jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/tenant/",
    search: "?mocked=query",
    hash: "#mocked-hash",
    state: { role: "tenant" },
    key: "mocked-key",
  }),
}));
*/
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

test("renders email input field-getByRole", () => {
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
  const emailInput = screen.getByRole("textbox");
  expect(emailInput).toBeInTheDocument();
});

test("Testing jest.fn()", () => {
  const mockFunction = jest.fn(() => {
    return "hello";
  });
  expect(mockFunction()).toBe("hello");
});
