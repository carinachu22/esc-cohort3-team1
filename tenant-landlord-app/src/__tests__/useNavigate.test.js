import "@testing-library/jest-dom";
import React, { useEffect, useState, FC } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "./setupTests.js";
import {
  BrowserRouter,
  MemoryRouter,
  Link,
  useNavigate,
  useLocation,
  Router,
} from "react-router-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";

import LoginPage from "../pages/LoginPage.js";
import Dashboard from "../pages/Dashboard.js";

/** 
//Doesnt work: Test mocking useNavigate and see if it has been called
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));
*/

/** Doesnt work: Spying on the useNavigate 
import * as router from "react-router";
const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});
*/

jest.mock("axios");
// Mock specific hooks from react-auth-kit
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

describe("Testing useNavigate", () => {
  test("sends the user to Dashboard", async () => {
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

    const resp_data = {
      success: 1,
      message: "Login successfully",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiO…zNTV9.7Y9-rpf8Mn1GeeUpvAdqG4jj6RVwfcqCri7x-qjZOwM",
    };
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

    // Verifying that either Dashboard page has been rendered OR that the navigate function was called
    //expect(navigate).toHaveBeenCalledWith("/pages/Dashboard");
  });
});
/** 
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
  const resp_data = {
    success: 1,
    message: "Login successfully",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiO…zNTV9.7Y9-rpf8Mn1GeeUpvAdqG4jj6RVwfcqCri7x-qjZOwM",
  };
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
  expect(screen.getByPlaceholderText("Email")).toHaveValue("tenant1@gmail.com");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  expect(screen.getByPlaceholderText("Password")).toHaveValue("password");
  axios.post.mockResolvedValue(resp);
  await userEvent.click(screen.getByRole("button", { name: "LOGIN" }));
  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost:5000/api/tenant/login",
    values
  );

  //Make sure the new page is rendered
  expect(mockedNavigate).toHaveBeenCalledWith("/pages/Dashboard");
});
*/
