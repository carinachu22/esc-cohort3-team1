import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import NavigationBar from '../components/NavigationBar.js';

// Import React and hooks
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';

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
    useToast,
    Select
} from "@chakra-ui/react";

const LandlordCreationPage = () => {
    const navigate = useNavigate();
    const token = useAuthHeader();
    const userDetails = useAuthUser();
    const toast = useToast();
    const authenticated = useIsAuthenticated();
    const [buildingOptionsHTML, setBuildingOptionsHTML] = useState("")


    var config
    if (authenticated()){
        config = {
            headers: {
            Authorization: `${token()}`
            },
            params: {
                email: userDetails().email,
            }
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

        if (values.role === 'staff'){
            if(!values.ticket_type){
                errors.ticket_type = "Required";
            }
        }

        if (userDetails().type === 'admin'){

            if(!values.public_building_id){
                errors.public_building_id = "Required";
            }

            if(!values.role){
                errors.role = "Required";
            }
        }

        return errors;
    }


    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
    }

    const BuildingOptions = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/admin/getBuildings",
            config
          );
          const building_list = response.data.data; // Assuming the response data is an array of buildings
          console.log(building_list);
          const temp_html = building_list.map((building) => (
            <option key={building.public_building_id} value={building.public_building_id}>
              {building.public_building_id}
            </option>
          ));
          setBuildingOptionsHTML(temp_html)
        } catch (error) {
          console.error("Error fetching building options:", error);
          return null;
        }
      };

    const navigateToAccountManagement = () => {
        navigate('/pages/AccountManagement');
    };

    const onSubmit = async (values) => {
        console.log("Values: ", values);

        try{
            var response;
            if (userDetails().type != "admin") {
                response = await axios.post(
                    //api to be added
                    "http://localhost:5000/api/landlord/create",
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
            } else {
                response = await axios.post(
                    //api to be added
                    "http://localhost:5000/api/admin/createLandlord",
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
            user_email: "",
            password: "",
            ticket_type: "",
            public_building_id: "",
            role: "",
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
        async function fetchData(){
            if (authenticate()){
                await BuildingOptions();
                formik.values.user_email = config.params.email
            }
        }
        fetchData()
    },
    [])

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
                        <Heading marginTop="4" >Create Staff</Heading>
                        {userDetails() && userDetails().type === 'admin' ?
                        <>
                        <FormControl marginTop="6">
                            <Select
                                id="building" 
                                name="public_building_id"
                                type="text" 
                                variant="filled"
                                placeholder="Building ID"
                                value={formik.values.public_building_id}
                                onChange={formik.handleChange}
                            >
                            {buildingOptionsHTML}
                            {formik.errors.public_building_id ? <Box color="red.500" marginBottom="-6">{formik.errors.public_building_id}</Box>: null}
                            </Select>
                        </FormControl>
                        <FormControl marginTop="6">
                            <Select
                                id="role" 
                                name="role"
                                type="text" 
                                variant="filled"
                                placeholder="Role"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                            >
                            <option value="staff">Staff</option>
                            <option value="supervisor">Supervisor</option>
                            {formik.errors.role ? <Box color="red.500" marginBottom="-6">{formik.errors.public_building_id}</Box>: null}
                            </Select>
                        </FormControl>
                        </>
                        : null }
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
                        { formik.values.role === 'supervisor' ? null :
                        <FormControl marginTop="6">
                            <Input
                                id="ticket_type" 
                                name="ticket_type"
                                type="text" 
                                variant="filled"
                                placeholder="Ticket Type"
                                value={formik.values.ticket_type}
                                onChange={formik.handleChange}
                                
                            />
                            {formik.errors.ticket_type ? <Box color="red.500" marginBottom="-6">{formik.errors.ticket_type}</Box>: null} 
                        </FormControl>
                        }

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

export default LandlordCreationPage