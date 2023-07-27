import styles from "../../styles/landing.module.css";
import React from 'react'

import {useNavigate} from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  VStack,
  Heading
} from "@chakra-ui/react";

const Landing = () => {

    const navigate = useNavigate();
    
  
    const navigateToLandlordLogin = (role) => {
      navigate('/pages/LoginPage', { state: { role } });
      
    };
  
    const navigateToTenantLogin = (role) => {
      navigate ('/pages/LoginPage', { state: { role } });
    };

    const navigateToAdminLogin = (role) => {
      navigate ('/pages/LoginPage', { state: { role } });
    };


    return (
        <Flex align="center" justify="center" h="100vh" w="100%">
          <Box w="22em" h="30em" p={6} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
            <VStack alignItems="center" >
              <Heading marginTop="10">Service Portal</Heading>
              <Button 
                onClick={() => navigateToTenantLogin('tenant')} 
                w="80%" 
                h="4em" 
                background="rgb(192, 17, 55)" 
                textColor="white" 
                variant="unstyled"
                marginTop="10"
              >
              TENANT LOGIN
              </Button>
              <Button 
                onClick={() => navigateToLandlordLogin('landlord')} 
                w="80%" 
                h="4em" 
                background="rgb(192, 17, 55)" 
                textColor="white" 
                variant="unstyled"
                marginTop="10"
              >
              LANDLORD LOGIN
              </Button>
              <Button 
                onClick={() => navigateToAdminLogin('admin')} 
                w="80%" 
                h="4em" 
                background="rgb(192, 17, 55)" 
                textColor="white" 
                variant="unstyled"
                marginTop="10"
                value="admin"
              >
              ADMIN LOGIN
              </Button>

            </VStack>
          </Box>
        </Flex>
      );

    
}

export default Landing