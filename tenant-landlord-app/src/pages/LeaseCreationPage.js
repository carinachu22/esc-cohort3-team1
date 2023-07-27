import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useSignIn } from "react-auth-kit";
import NavigationBar from '../components/NavigationBar.js';

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
} from "@chakra-ui/react";

const LeaseCreationPage = () => {
    const navigate = useNavigate();
    const validate = values => {
        let errors = {};


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
                console.log("Error: ", err);
            }
            else if (err && err instanceof Error){
                console.log("Error: ", err);
            }
        }
    }
  


    const formik = useFormik({
        initialValues: {
            building_name: "",
            commencement_date: "",
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
                        <Heading marginTop="4">Create New Tenant</Heading>
                        <FormControl marginTop="6">
                            <Input
                                id="building_name" 
                                name="building_name"
                                type="text" 
                                variant="filled"
                                placeholder="building name"
                                value={formik.values.building_name}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <FormControl marginTop="6">
                            <InputGroup size='md'>
                                <Input
                                    id="commencement_date"
                                    name="commencement_date" 
                                    pr='4.5rem'
                                    type="text" 
                                    placeholder="commencement date"
                                    variant="filled"
                                    value={formik.values.commencement_date}
                                    onChange={formik.handleChange}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h='1.75rem' size='sm' onClick={togglePassword}  variant="unstyled">
                                        {passwordShown ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>                        
                        </FormControl>
                        <FormControl marginTop="6" >
                            <Button 
                                id="DoneButton"
                                type="submit" 
                                isLoading={formik.isSubmitting} 
                                backgroundColor="rgb(192, 17, 55)" 
                                width="full" 
                                textColor="white" 
                                variant="unstyled"
                                onClick={formik.onSubmit}
                                > 
                                Done
                            </Button>
                        </FormControl>
                        
                    </VStack>
                </form>
            </Box>
        </Flex>
        </>
    )

}

export default LeaseCreationPage