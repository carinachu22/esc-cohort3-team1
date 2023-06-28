import React, { useState } from "react";
import SignupStyles from "../styles/signup_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';

const LandlordSignup = () => {
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
      //passwordShown = true if handler is invoked  
      setPasswordShown(!passwordShown)
    }
  
  const navigateToDashboard = () => {
    navigate('/pages/Dashboard');
  };

  return (
      <div className={SignupStyles.page}>
          <div className={SignupStyles.cover}>
              <h1 className={SignupStyles.header}>Register</h1>
              <div className={SignupStyles.context}>sign up as a landlord</div>
              <input type="text" className={SignupStyles.input} placeholder="USERNAME" />
              <input type="email" className={SignupStyles.input} placeholder="EMAIL" />
              <div className={PasswordStyles.passwordToggle}>
                <input 
                    type={passwordShown ? "text" : "password"} 
                    placeholder="PASSWORD"
                    className={PasswordStyles.passwordInput}
                />
                <span onClick={togglePassword}>
                    {passwordShown ? "Hide" : "Show"}
                </span>
              </div>
              <input type="text" className={SignupStyles.input} placeholder="TICKET TYPE" />
              <div className={SignupStyles.next_btn} onClick={navigateToDashboard}>FINISH</div>


          </div>
      </div>

  
  )
}

export default LandlordSignup