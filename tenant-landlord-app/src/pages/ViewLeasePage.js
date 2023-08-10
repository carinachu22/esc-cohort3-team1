import React, { useEffect, useState } from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate , useLocation } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar.js';
import { useAuthHeader, useIsAuthenticated } from 'react-auth-kit';


function ViewLeasePage() {
    const [pdfUrl,setPdfUrl] = useState('')
    const navigate = useNavigate();
    const token = useAuthHeader(); 
    const location = useLocation();
    console.log(location)
    var tenantID;
    if (location.state != null){
      tenantID = location.state.tenantID;
    }
    const authenticated = useIsAuthenticated();
    console.log("tenantID: ", tenantID);

    const navigateToAccountManagement = () => {
      navigate('/pages/AccountManagement/');
    }

    useEffect(() => {
        if (authenticate()){
        fetch(`http://localhost:5000/api/landlord/getLease/?tenantID=${tenantID}`, {
            headers:{
                Authorization: `${token()}`
            }
        }) 
        .then((response) => response.blob())
        .then((data) => {
            console.log('data',data)
            const pdfBlobUrl = URL.createObjectURL(data);
            setPdfUrl(pdfBlobUrl);
        })
        .catch((error) => {
            console.error(error);
            // Handle error
        });
    }}, []);

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


    return (
        <>
        {NavigationBar()}
        <Box p={10} bg="#EDF2F7" borderRadius="md" boxShadow="lg" mr = "10%" ml="10%">
            <Heading mb={5} textAlign="center" >Current Lease</Heading>
            <Box display="flex" flexDirection="column" justifyContent="center" minHeight="50vh">
                {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
            <Box display="flex" justifyContent="space-around" m={1} p={1}>
                <Button leftIcon={<ArrowBackIcon />} colorScheme="teal" variant="outline" onClick={() => navigate(-1)}>
                Back
                </Button>
                <Button leftIcon={<ArrowForwardIcon />} colorScheme="red" variant="outline" onClick={() => navigateToAccountManagement()}>
                Next
                </Button>
            </Box>
            </Box>
        </Box>
        </>
    );
}

export default ViewLeasePage;
