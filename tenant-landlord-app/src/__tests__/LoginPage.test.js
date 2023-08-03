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
import axios, { AxiosError } from "axios";

import LoginPage from "../pages/LoginPage.js";
import Dashboard from "../pages/Dashboard.js";

jest.mock("axios");

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

  test("Valid email and password successfuly calls login API", async () => {
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
    const resp_data = [
      {
        tenant_user_id: 38,
        email: "tenant1@gmail.com",
        password:
          "$2b$10$muetmRj1fDH.93XKBFt2yO.GMeLlDJLzB5fniGDLb/0lRNLjzb80y",
        public_building_id: "RC",
        public_lease_id: "1690926182158",
        deleted_date: null,
      },
    ];
    const resp = { data: resp_data };
    const values = {
      email: "tenant1@gmail.com",
      hasError: false,
      password: "password",
    };
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "tenant1@gmail.com"
    );
    expect(screen.getByPlaceholderText("Email")).toHaveValue(
      "tenant1@gmail.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Password"), "password");
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password");
    axios.post.mockResolvedValue(resp);
    await userEvent.click(screen.getByRole("button", { name: "LOGIN" }));
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/tenant/login",
      values
    );
  });

  test("Show button clicked, Toggle Password visible", async () => {
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
