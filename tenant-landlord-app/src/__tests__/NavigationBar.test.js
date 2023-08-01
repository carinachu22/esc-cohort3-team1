import React from "react";
import { render, screen, waitFor } from "./setupTests.js";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { AuthProvider, useSignIn } from "react-auth-kit";
import NavigationBar from "../pages/NavigationBar.js";

// Mock the useAuthUser hook
jest.mock("react-auth-kit")

test("Renders Navigation Bar", () => {
  render(
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    </AuthProvider>
  );



});

