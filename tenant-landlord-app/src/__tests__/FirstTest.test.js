import React from "react";
import { render,  screen } from "@testing-library/react";
import FirstTest from "../component_test/FirstTest.js";
import CreateTicketPage from "../pages/CreateTicketPage";
import { BrowserRouter as Router } from 'react-router-dom';
import App from "../pages/App.js";
import '@testing-library/jest-dom'
test("Testing the set up file", () => {
  render(<FirstTest />);

  
  const element = screen.getByText(/first test/i);

  expect(element).toBeInTheDocument();
});

test ("dummy test", () => {
  expect()
})

test("Render Create Ticket Page", () => {
  render(    
  <Router>
    <App />
  </Router>);
  //expect(screen.getByText(/Create A Service Ticket/i)).toBeInTheDocument();
});
