/** README
 * This file has 2 successful method to check if navigate() has been called
 * 1. Spying on the actual navigate() from the component
 * 2. Mocking the useNavigate() hook
 *
 * This file currently is working for number 1).
 * For number 2. to work, You have to uncomment 3 things
 * i) "useNavigate: () => mockNavigate," in the jest.mock("react-router-dom")
 * ii)const mockNavigate = jest.fn(); // Create a mock function
 * iii) uncomment test2, and comment test1 to run
 *
 */

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

//const mockNavigate = jest.fn(); // Create a mock function
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
    //useNavigate: () => mockNavigate,
  };
});

describe("useNavigate", () => {
  test("1. Spying on useNavigate", async () => {
    const navigateSpy = jest.spyOn(require("react-router-dom"), "useNavigate");
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

    // Assert that the navigate function was called with the correct path
    expect(navigateSpy).toHaveBeenCalled();

    // Clean up the spy
    navigateSpy.mockRestore();
  });

  /**test("2: mocking useNavigate", async () => {
   * // Remember to uncomment the useNavigate mock above
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

    // Assert that the navigate function was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/pages/Dashboard");
  });
  */
});
