import React, { useEffect, useState } from "react";
import styles from "../../styles/landing.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {useNavigate} from 'react-router-dom';

const Landing = () => {

    const navigate = useNavigate();
  
    const navigateToLandlordLogin = () => {
      navigate('/pages/landlord_login');
      
    };
  
    const navigateToTenantLogin = () => {
      navigate ('/pages/tenant_login');
      
    };


    return (
        <div className={styles.page}>
          <div className={styles.cover}>
            <h1>Service Portal</h1>
            <div className={styles.tenant_btn} onClick={navigateToTenantLogin}>TENANT LOGIN</div>
            <div className={styles.landlord_btn} onClick={navigateToLandlordLogin}>LANDLORD LOGIN</div>

          </div>
          
        </div>
      );

    
}

export default Landing