import Landing from '../components/landing_form/landing';
import React, {useState} from 'react';
import LandlordLogin from './landlord_login';
import TenantLogin from './tenant_login';
import {Routes, Route, useNavigate} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div className='App-cover'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pages/tenant_login" element={<TenantLogin />} />
          <Route path="/pages/landlord_login" element={<LandlordLogin />} />
        </Routes>
      </div>
      
    </div>
  );
}

export default App;
