import React from "react";
import { render, screen } from "@testing-library/react";
import FirstTest from "../component_test/FirstTest";
import CreateTicketPage from "../pages/CreateTicketPage";
import App from "../pages/App.js";
test("Testing the set up file", () => {
  render(<FirstTest />);

  const element = screen.getByText(/first test/i);

  expect(element).toBeInTheDocument();
});

test("Render Create Ticket Page", () => {
  render(<App />);
  //expect(screen.getByText(/Create A Service Ticket/i)).toBeInTheDocument();
});
