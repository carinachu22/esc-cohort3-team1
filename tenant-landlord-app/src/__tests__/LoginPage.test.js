import "@testing-library/jest-dom";
import React, { useEffect, useState } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./setupTests.js";
import {
  BrowserRouter,
  MemoryRouter,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
//import axios, { AxiosError } from "axios";

import LoginPage from "../pages/LoginPage.js";
import Dashboard from "../pages/Dashboard.js";

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

    //Check if login button is still there - it is :( )
    const submitBtn = screen.queryByRole("button", { name: "LOGIN" });
    expect(submitBtn).toBeInTheDocument();
  });

  test("Toggle Password visible", async () => {
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
    await userEvent.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByText(/Hide/i)).toBeInTheDocument(); // TODO: Mock API calls, go to navigateDashboard page
  });

  test("Fill up email input", async () => {
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
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "tenant1@gmail.com"
    );
    expect(screen.getByPlaceholderText("Email")).toHaveValue(
      "tenant1@gmail.com"
    );
  });

  test("Fill up password input", async () => {
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
    await userEvent.type(screen.getByPlaceholderText("Password"), "password");
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password");
  });
});
