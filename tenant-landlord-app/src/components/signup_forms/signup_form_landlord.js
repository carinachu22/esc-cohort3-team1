import React, { useState } from "react";
import styles from "../../styles/signup_form_landlord.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';
import UsePasswordToggle from "../../hooks/usePasswordToggle";

const SignupLandlord = () => {
  const navigate = useNavigate();
  
  const navigateToDashboard = () => {
    navigate('/pages/Dashboard');
  };

  return (
      <div className={styles.page}>
          <div className={styles.cover}>
              <h1 className={styles.header}>Register</h1>
              <div className={styles.context}>sign up as a landlord</div>
              <input type="text" className={styles.input} placeholder="USERNAME" />
              <input type="email" className={styles.input} placeholder="EMAIL" />
              <input type="text" className={styles.input} placeholder="ORGANISATION" />
              <UsePasswordToggle/>
              <div className={styles.next_btn} onClick={navigateToDashboard}>FINISH</div>


          </div>
      </div>

  
  )
}

export default SignupLandlord