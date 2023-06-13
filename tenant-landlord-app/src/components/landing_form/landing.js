import React, { useEffect, useState } from "react";
import "./landing.css"
import LandlordLogin from "../../pages/landlord_login";
import TenantLogin from "../../pages/tenant_login";
import "bootstrap/dist/css/bootstrap.min.css";

import {Routes, Route, useNavigate} from 'react-router-dom';

const Landing = () => {

    const navigate = useNavigate();
  
    const navigateToLandlordLogin = () => {
      navigate('/pages/landlord_login');
      
    };
  
    const navigateToTenantLogin = () => {
      navigate ('/pages/tenant_login');
      
    };


    return (
        <div className="page">
          <div className='cover'>
            <h1>Service Portal</h1>
            <div className="tenant-btn" onClick={navigateToTenantLogin}>TENANT LOGIN</div>
            <div className="landlord-btn" onClick={navigateToLandlordLogin}>LANDLORD LOGIN</div>
            <Routes>
              <Route path="/pages/tenant_login" element={<TenantLogin />} />
              <Route path="/pages/landlord_login" element={<LandlordLogin />} />
            </Routes>

          </div>
          
        </div>
      );

    
}

export default Landing