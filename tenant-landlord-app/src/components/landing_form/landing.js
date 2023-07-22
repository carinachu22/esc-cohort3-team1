import styles from "../../styles/landing.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {useNavigate} from 'react-router-dom';
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

const Landing = () => {

    const navigate = useNavigate();
  
    const navigateToLandlordLogin = () => {
      navigate('/pages/landlord_login');
      
    };
  
    const navigateToTenantLogin = () => {
      navigate ('/pages/tenant_login');
    };

    const navigateToAdminLogin = () => {
      navigate ('/pages/admin_login');
    };


    return (
        <Flex align="center" justify="center" h="100vh" w="100%">
          <Box w="22em" h="30em" p={6} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
            <VStack alignItems="center" >
              <Heading marginTop="10">Service Portal</Heading>
              <Button 
                onClick={navigateToTenantLogin} 
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
                onClick={navigateToLandlordLogin} 
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
                onClick={navigateToAdminLogin} 
                w="80%" 
                h="4em" 
                background="rgb(192, 17, 55)" 
                textColor="white" 
                variant="unstyled"
                marginTop="10"
              >
              ADMIN LOGIN
              </Button>

            </VStack>
          </Box>
        </Flex>
      );

    
}

export default Landing