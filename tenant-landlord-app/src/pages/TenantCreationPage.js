import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import NavigationBar from '../components/NavigationBar.js';

// Import React and hooks
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Heading,
    useToast
} from "@chakra-ui/react";

const TenantCreationPage = () => {
    const navigate = useNavigate();
    const token = useAuthHeader();
    const userDetails = useAuthUser();
    const toast = useToast();
    const authenticated = useIsAuthenticated();

    const config = {
        headers: {
          Authorization: `${token()}`
        },
        params: {
            email: userDetails().email
        }
      }

    

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

    const navigateToAccountManagement = () => {
        navigate('/pages/AccountManagement');
    };

    const APIGetBuildingID = async (email) => {
        const response = await axios.get(
            "http://localhost:5000/api/landlord/getTenantAccounts?landlordEmail=" + email,
            config
        )
        console.log("APIGetBuildingID", response)
        return response
    }

    const onSubmit = async (values) => {
        console.log("Values: ", values);

        try{
            const response = await axios.post(
                //api to be added
                "http://localhost:5000/api/landlord/createTenant",
                values,
                config
            )
            console.log("response", response);
            if (response.data.message === "created successfully"){
                navigateToAccountManagement();
            } else if (response.data.message === "Duplicate email entry"){
                toast({
                    title: "Email already exist!",
                    description: "Please register with a different email",
                    status: "success",
                    colorScheme: "red",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    })
            }
        } catch (err){
            if (err && err instanceof AxiosError) {
                console.log("Error: ", err);
            }
            else if (err && err instanceof Error){
                console.log("Error: ", err);
            }
        }
    }
  


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            landlordEmail: config.params.email,
            hasError: false
        },
        onSubmit,
        validate
    });


    // Ensure that user is authenticated for all renders
    const authenticate = () => {
        // Check if still autenticated based on react auth kit
        if (!authenticated()){
            console.log("Not authenticated, redirecting.")
            navigate('/')
            return false
        } else {
            return true
        }
    }
    useEffect(() => {
        authenticate()
    })


    /////// code below uses Chakra styling ////////
    return (
        <>
        {NavigationBar()}
        <Flex align="center" justify="center" h="100vh" w="100%">
            <Box w="22em" h="30em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
                <form onSubmit={formik.handleSubmit}>
                    <VStack align="flex-start" alignItems="center">
                        <Heading marginTop="4" >Create Tenant</Heading>
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
                                CREATE
                            </Button>
                            {formik.errors.hasError ? <Box color="red.500" id="errorMessage" marginBottom="-6" >Invalid email or password</Box>: null}
                        </FormControl>
                        
                    </VStack>
                </form>
            </Box>
        </Flex>
        </>
    )

}

export default TenantCreationPage