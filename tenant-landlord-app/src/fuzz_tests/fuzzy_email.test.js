import "@testing-library/jest-dom";
import React, { useEffect, useState } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../__test__/setupTests";
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
import {
  generateRandomEmailInput,
  generateValidEmailInput,
} from "./email_generator";
jest.setTimeout(200000);
jest.mock("axios");

jest.mock("react-auth-kit", () => {
  const originalModule = jest.requireActual("react-auth-kit");
  return {
    ...originalModule,
    useAuthUser: () => () => ({
      email: "tenant1@gmail.com",
      type: "tenant",
    }),
    useAuthHeader: () =>
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiO…zNTV9.7Y9-rpf8Mn1GeeUpvAdqG4jj6RVwfcqCri7x-qjZOwM",
    useIsAuthenticated: () => () => true,
  };
});
jest.mock("react-router-dom", () => {
  const originalModule1 = jest.requireActual("react-router-dom");
  return {
    ...originalModule1,
    useLocation: () => ({
      pathname: "/tenant/",
      search: "?mocked=query",
      hash: "#mocked-hash",
      state: { role: "tenant" },
      key: "mocked-key",
    }),
  };
});
describe("Fuzzy testing email", () => {
  test("100 fuzz randomly generated email input", async () => {
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

    const numTests = 10; // Number of fuzz tests
    for (let i = 0; i < numTests; i++) {
      const email = generateRandomEmailInput();

      await userEvent.type(screen.getByPlaceholderText("Email"), email);
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        expect(screen.queryByText(/Invalid Email/i)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(/Invalid Email/i)).not.toBeInTheDocument();
      }

      await userEvent.clear(screen.getByPlaceholderText("Email"));
    }
  });

  //Testing valid emails (White box testing)
  test("100 valid email input", async () => {
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

    const numTests = 10; // Number of fuzz tests
    for (let i = 0; i < numTests; i++) {
      const email = generateValidEmailInput();
      await userEvent.type(screen.getByPlaceholderText("Email"), email);

      expect(screen.queryByText(/Invalid Email/i)).not.toBeInTheDocument();

      await userEvent.clear(screen.getByPlaceholderText("Email"));
    }
  });
});
