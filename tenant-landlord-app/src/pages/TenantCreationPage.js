import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {setIn, useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";
import NavigationBar from '../components/NavigationBar';

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
} from "@chakra-ui/react";

const TenantCreationPage = () => {
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

    const navigateToAccountManagement = () => {
        navigate('/pages/AccountManagement');
    };

    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try{
            const response = await axios.post(
                //api to be added
                "http://localhost:5000/api/landlord/createTenant",
                values
            )
            console.log(response);
            if (response.data.message === "created successfully"){
                navigateToAccountManagement();
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
            buildingID: "",
            hasError: false
        },
        onSubmit,
        validate
    });




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
                        <FormControl marginTop="6">
                            <InputGroup size='md'>
                                <Input
                                    id="buildingID"
                                    name="buildingID" 
                                    pr='4.5rem'
                                    type="text"
                                    placeholder="Building ID"
                                    variant="filled"
                                    value={formik.values.buildingID}
                                    onChange={formik.handleChange}
                                />
                            </InputGroup>                        
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