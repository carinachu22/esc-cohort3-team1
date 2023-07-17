import Landing from '../components/landing_form/landing';
import React from 'react';
import LandlordLogin from './landlord_login';
import TenantLogin from './tenant_login';
import LandlordSignup from './landlord_signup';
/*import TenantSignup from './tenant_signup';*/
import Dashboard from './Dashboard';
import CloseTicketPage from './CloseTicketPage';
import FeedbackForm from './FeedbackForm';
import CreateTicketPage from './CreateTicketPage'; 
import ViewTicketPage from './ViewTicketPage';
import TicketList from './TicketList';

import {Routes, Route} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <div className='App-cover'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pages/tenant_login/*" element={<TenantLogin />} />
          <Route path="/pages/landlord_login/*" element={<LandlordLogin />} />
          <Route path="/pages/landlord_signup/*" element={<LandlordSignup />} />
          <Route path='/pages/Dashboard/*' element={<Dashboard/>} />
          <Route path='/pages/TicketList/*' element={<TicketList/>} />
          <Route path='/pages/CloseTicketPage/*' element={<CloseTicketPage/>} />
          <Route path='/pages/FeedbackForm/*' element={<FeedbackForm/>} />
          <Route path='/pages/CreateTicketPage/*' element={<CreateTicketPage/>} />
          <Route path='/pages/ViewTicketPage/*' element={<ViewTicketPage/>} />
        </Routes>
      </div>
      
    </div>
  );
}

export default App;
