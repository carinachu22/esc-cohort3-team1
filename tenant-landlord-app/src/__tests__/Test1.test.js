import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import LoginPage from "../pages/LoginPage.js";

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
