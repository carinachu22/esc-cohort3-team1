import Landing from '../components/landing_form/landing.js';
import React from 'react';
import LoginPage from './LoginPage.js';
import LandlordSignup from './landlord_signup.js';
import Dashboard from './Dashboard.js';
import FeedbackForm from './FeedbackForm.js';
import CreateTicketPage from './CreateTicketPage.js'; 
import ViewTicketPage from './ViewTicketPage.js';
import QuotationPage from './QuotationPage.js';
import ForgotPasswordPage from './ForgotPasswordPage.js';
import TicketList from './TicketList.js';
import AccountManagement from './AccountManagement.js';
import QuotationUpload from './QuotationUploadPage.js';
import TenantCreationPage from './TenantCreationPage.js';
import ViewLeasePage from './ViewLeasePage.js';
import LeaseUpload from './LeaseUploadPage.js';


import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";



function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <div className='App-cover'>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pages/LoginPage/*" element={<LoginPage />} />
            <Route path="/pages/QuotationUploadPage/*" element={<QuotationUpload />} />
            <Route path="/pages/TenantCreationPage/*" element={<TenantCreationPage />} />
            <Route path='/pages/ForgotPasswordPage' element={<ForgotPasswordPage/>} />
            <Route path="/pages/landlord_signup/*" element={<LandlordSignup />} />
            <Route path='/pages/Dashboard/*' element={<Dashboard/>} />
            <Route path='/pages/TicketList/*' element={<TicketList/>} />
            <Route path='/pages/FeedbackForm/*' element={<FeedbackForm/>} />
            <Route path='/pages/CreateTicketPage/*' element={<CreateTicketPage/>} />
            <Route path='/pages/ViewTicketPage/*' element={<ViewTicketPage/>} />
            <Route path='/pages/QuotationPage/*' element={<QuotationPage />} />
            <Route path='/pages/AccountManagement/*' element={<AccountManagement/>} />
            <Route path='/pages/ViewLeasePage/*' element={<ViewLeasePage/>} />
            <Route path='/pages/LeaseUploadPage/*' element={<LeaseUpload/>} />
          </Routes>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
