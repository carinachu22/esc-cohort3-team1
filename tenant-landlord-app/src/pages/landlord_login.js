import React, { useState } from "react";
import LoginStyles from "../styles/login_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {setIn, useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";
import LoginForm from "../components/login_form";
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

const LandlordLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const signIn = useSignIn();

    const validate = values => {
        let errors = {};
        
        if (!values.email){
            errors.email = "Required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
            errors.email = "Invalid email";
        }

        if(!values.password){
            errors.password = "Required";
        }

        return errors;
    }


    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
    }

    const navigateToDashboard = () => {
        navigate('/pages/Dashboard');
    };

    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try{
            const response = await axios.post(
                //api to be added
                "http://localhost:5000/api/landlord/login",
                values
            )
            console.log(response);
            signIn({
                token: response.data.token,
                expiresIn: 60,
                tokenType: "Bearer",
                authState: {email: values.email, type: "landlord"}
            });
            if (response.data.message === "Login successfully"){
                console.log(response.data.message);
                navigateToDashboard();
            }
            else if (response.data.message === "Invalid email or password"){
                formik.errors.hasError = true;
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
  


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            hasError: false
        },
        onSubmit,
        validate
    });




    /////// code below uses Chakra styling ////////
    return (
        <Flex align="center" justify="center" h="100vh" w="100%">
            <Box w="22em" h="30em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
                <form onSubmit={formik.handleSubmit}>
                    <VStack align="flex-start" alignItems="center">
                        <Heading marginTop="4">Welcome!</Heading>
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
                        <FormControl marginTop="6" >
                            <Button 
                                id="loginButton"
                                type="submit" 
                                isLoading={formik.isSubmitting} 
                                backgroundColor="rgb(192, 17, 55)" 
                                width="full" 
                                textColor="white" 
                                variant="unstyled"
                                onClick={formik.onSubmit}
                                > 
                                LOGIN
                            </Button>
                            {formik.errors.hasError ? <Box color="red.500" id="errorMessage" marginBottom="-6" >Invalid email or password</Box>: null}
                        </FormControl>
                        <Box fontSize="lg" textColor="blue.700" marginTop={10}>
                            <Link to="/pages/landlord_signup">Don't have an account?</Link>
                        </Box>
                        
                        <Box fontSize="lg" textColor="blue.700" marginTop={2}>
                            <Link to="/pages/ForgotPasswordPage">Forgot password?</Link>
                        </Box>
                        
                    </VStack>
                </form>
            </Box>
        </Flex>
    )


    /////////// CODE BELOW USES CSS STLYING ////////////
    // return (
    //     <div className={LoginStyles.page}>
    //         <form className={LoginStyles.cover} onSubmit={formik.handleSubmit}>
    //             <h1 className={LoginStyles.header}>Welcome!</h1>
    //             <input 
    //                 name="email"
    //                 type="email" 
    //                 placeholder="EMAIL" 
    //                 value={formik.values.email}
    //                 className={LoginStyles.input}
    //                 onChange={formik.handleChange}
    //             />
    //             <div className={PasswordStyles.passwordToggle}>
    //                 <input
    //                     name="password" 
    //                     type={passwordShown ? "text" : "password"} 
    //                     placeholder="PASSWORD"
    //                     className={PasswordStyles.passwordInput}
    //                     value={formik.values.password}
    //                     onChange={formik.handleChange}
    //                 />
    //                 <span onClick={togglePassword}>
    //                     {passwordShown ? "Hide" : "Show"}
    //                 </span>
    //             </div>

    //             <button className={LoginStyles.login_btn} type="submit" isLoading={formik.isSubmitting}>LOGIN</button>
    //             <div className={LoginStyles.sign_up}>Don't have an account? <Link to="/pages/landlord_signup" className={LoginStyles.sign_up_link}>Sign up!</Link></div>
    //             <Link className={LoginStyles.password_reset}>forget password?</Link>

    //         </form>
    //     </div>
    // )
}

export default LandlordLogin