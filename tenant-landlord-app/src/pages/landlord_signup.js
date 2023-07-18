import React, { useState } from "react";
import SignupStyles from "../styles/signup_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  Center,
  Text,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";

const LandlordSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = useSignIn();

  const [passwordShown, setPasswordShown] = useState(false);

  const validate = values => {
    let errors = {};
    
    if (!values.email){
        errors.email = "Required";
    } 

    if(!values.password){
        errors.password = "Required";
    }

    return errors;
  }

  const togglePassword = () => {
      //passwordShown = true if handler is invoked  
      setPasswordShown(!passwordShown)
    }

  const onSubmit = async (values) => {
    console.log("Values: ", values);
    setError("");

    try{
        const response = await axios.post(
            "http://localhost:5000/api/landlord/create",
            values
        )
        console.log(response);
        signIn({
            token: response.data.token,
            expiresIn: 60,
            tokenType: "Bearer",
            authState: {email: values.email}
        });
        if (response.data.message === "created successfully"){
            navigateToDashboard();
        }



    } catch (err){
        if (err && err instanceof AxiosError) {
            setError(err.response?.data.message);
        }
        else if (err && err instanceof Error){
            setError(err.message);
        }

        console.log("Error: ", err);
    }
  }

  const navigateToDashboard = () => {
    navigate('/pages/Dashboard');
  };

  const formik = useFormik({
    initialValues: {
        email: "",
        password: "",
        ticket_type: ""
    },
    onSubmit,
    validate
  });

  ///// CODE BELOW USES CHAKRA ///////
  return (
    <Flex align="center" justify="center" h="100vh" w="100%">
        <Box w="22em" h="30em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
            <form onSubmit={formik.handleSubmit}>
                <VStack align="flex-start" alignItems="center">
                    <Heading marginTop="4">Register</Heading>
                    <Box >Sign up as a landlord</Box>
                    <FormControl marginTop="6">
                        <Input
                            id="email" 
                            name="email"
                            type="email" 
                            variant="filled"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.email ? <Box color="red.500" marginBottom="-6">{formik.errors.email}</Box>: null}
                    </FormControl>
                    <FormControl marginTop="6">
                        <InputGroup size='md'>
                            <Input
                                id="password"
                                name="password" 
                                pr='4.5rem'
                                type={passwordShown ? "text" : "password"} 
                                placeholder="Password"
                                variant="filled"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h='1.75rem' size='sm' onClick={togglePassword}  variant="unstyled">
                                    {passwordShown ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {formik.errors.password ? <Box color="red.500"  marginBottom="-6">{formik.errors.password}</Box>: null}                          
                    </FormControl>
                    <FormControl marginTop="6">
                        <Input
                            id="ticket_type"
                            name="ticket_type"
                            type="text" 
                            variant="filled"
                            placeholder="TICKET TYPE" 
                            value={formik.values.ticket_type}
                            onChange={formik.handleChange}
                        />
                    </FormControl>
                    <FormControl marginTop="6">
                        <Button 
                            id="loginButton"
                            type="submit" 
                            isLoading={formik.isSubmitting} 
                            backgroundColor="rgb(192, 17, 55)" 
                            width="full" 
                            textColor="white" 
                            variant="unstyled"
                            > 
                            FINISH
                        </Button>
                        <Box color="red.500" id="errorMessage" visibility="hidden" marginBottom="-6">Invalid email or password!</Box>
                    </FormControl>
                </VStack>
            </form>
        </Box>
    </Flex>
  )

  ///// CODE BELOW USES CSS STYLING //////
  // return (
  //     <div className={SignupStyles.page}>
  //         <form className={SignupStyles.cover} onSubmit={formik.handleSubmit}>
  //             <h1 className={SignupStyles.header}>Register</h1>
  //             <div className={SignupStyles.context}>sign up as a landlord</div>
  //             <input
  //               name="email" 
  //               type="email" 
  //               className={SignupStyles.input} 
  //               placeholder="EMAIL" 
  //               value={formik.values.email}
  //               onChange={formik.handleChange}
  //             />
  //             <div className={PasswordStyles.passwordToggle}>
  //               <input
  //                   name="password" 
  //                   type={passwordShown ? "text" : "password"}
  //                   placeholder="PASSWORD"
  //                   className={PasswordStyles.passwordInput}
  //                   value={formik.values.password}
  //                   onChange={formik.handleChange}
  //               />
  //               <span onClick={togglePassword}>
  //                   {passwordShown ? "Hide" : "Show"}
  //               </span>
  //             </div>
  //             <input 
  //               name="ticket_type"
  //               type="text" 
  //               className={SignupStyles.input} 
  //               placeholder="TICKET TYPE" 
  //               value={formik.values.ticket_type}
  //               onChange={formik.handleChange}
  //             />
  //             <button className={SignupStyles.next_btn} type="submit" isLoading={formik.isSubmitting}>FINISH</button>


  //         </form>
  //     </div>
  // )

}

export default LandlordSignup