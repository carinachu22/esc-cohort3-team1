// Import react-bootstrap components

import { Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";
import { useEffect } from 'react';
import Popup from 'reactjs-popup';
import AccountManagementTable from '../components/AccountManagementTable.js';

// Import React and hooks
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import NavigationBar from '../components/NavigationBar.js';
import { Accordion, 
    AccordionButton, 
    AccordionItem, 
    AccordionPanel,
    Flex, 
    TableContainer, 
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Button,
    Box, 
    AccordionIcon, 
    HStack,
    useDisclosure,
    IconButton,
    FormControl,
    extendTheme,
    CSSReset,
    ChakraProvider,
    } from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons'

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
import React, { useState } from "react";
// import TableStyles from "../styles/signup_form_landlord.module.css";
import TableStyles from "../styles/account_management.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';
import {Form, useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";


const AccountManagement = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const [tenantAccounts, setTenantAccounts] = useState(null)
  const [landlordAccounts, setLandlordAccounts] = useState(null)
  const [landlordRole, setLandlordRole] = useState(null);

  const token = useAuthHeader();
  const userDetails = useAuthUser();
  const authenticated = useIsAuthenticated();

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

  /**
   * Set the theme of the entire page
   */
  const customTheme = extendTheme({
    styles: {
      global: {
        body: {
          bg: "gray.200", // Set the desired background color here
        },
      },
    },
  });



  const navigateToViewLeasePage = (tenantID) => {
    navigate('/pages/ViewLeasePage/', { state: { tenantID } } );
  }

  const navigateToLeaseUploadPage = (tenantID) => {
    navigate('/pages/LeaseUploadPage/', { state: { tenantID } } );
  }

  /**
   * check if landlord is a supervisor
   * @param {*} email 
   * @returns 
   */
  const getLandlordRole = async (email) => {
    const response = await axios.get(
      "http://localhost:5000/api/landlord/getLandlordDetails?landlordEmail=" + email,
      config
    )
    const role = response.data.data.role;
    console.log("role: ", role);
    setLandlordRole(role);

  }

  // const displayTable = () => {
  //   const type = userDetails().type;
  //   const email = userDetails().email;
  //   if (type === "landlord"){
  //     const role = userDetails().role;
  //     if (role === "supervisor"){
  //       {AccountManagementTable(() => APIDeleteAllLandlords(email), "Landlord", landlordAccounts, landlordRole)}
  //     }
  //   }
  // }


  /**
   * get all tenant accounts under the same building as the landlord user
   * @param {*} email 
   * @returns 
   */
  const APIGetTenantAccounts = async (email) => {
    const response = await axios.get(
        "http://localhost:5000/api/landlord/getTenantAccounts?landlordEmail=" + email,
        config
    )
    console.log("APIGetTenantAccounts", response)
    return response
  }

  /**
   * get all landlord staff accounts under the same building as the supervisor landlord
   * This is accessible only to the landlord supervisor
   * @param {*} email 
   * @returns 
   */
  const APIGetLandlordAccounts = async (email) => {
    const response = await axios.get(
        "http://localhost:5000/api/landlord/getLandlordAccounts?landlordEmail=" + email,
        config
    )
    console.log("APIGetLandlordAccounts", response)
    return response
  }
  
  /**
   * Delete all tenant acounts under the same building as the landlord user
   * @param {*} email 
   */
  const APIDeleteAllTenants = async (email) => {
    const response = await axios.patch(
        "http://localhost:5000/api/landlord/deleteAllTenants?landlordEmail=" + email,{
          headers: {
            Authorization: `${token()}`
          }
        }
    )
    //refresh the tenant details table
    GetTenantAccounts();
    GetLandlordAccounts();
  }

  /**
   * Delete all landlord staff acounts under the same building as the supervisor landlord
   * This is accessible only to the landlord supervisor
   * @param {*} email 
   */
    const APIDeleteAllLandlords = async (email) => {
      const response = await axios.patch(
          "http://localhost:5000/api/landlord/deleteAllLandlords?landlordEmail=" + email,{
            headers: {
              Authorization: `${token()}`
            }
          }
      )
      //refresh the tenant details table
      GetTenantAccounts();
      GetLandlordAccounts();
    }


  /**
   * Delete individual tenant account 
   * @param {*} email 
   */
  const APIDeleteTenantByEmail = async (email) => {
    const response = await axios.patch(
        "http://localhost:5000/api/landlord/deleteTenantByEmail",
        {email, },
        {
          headers: {
            Authorization: `${token()}`
          }
        }
    )
    //refresh the tenant details table
    GetTenantAccounts();
    GetLandlordAccounts();
    console.log("bye");

  }

    /**
   * Delete all landlord staff acounts under the same building as the supervisor landlord
   * This is accessible only to the landlord supervisor
   * @param {*} email 
   */
    const APIDeleteLandlordByEmail = async (email) => {
      const response = await axios.patch(
          "http://localhost:5000/api/landlord/deleteLandlordByEmail",
          {email, },
          {
            headers: {
              Authorization: `${token()}`
            }
          }
      )
      //refresh the tenant details table
      GetTenantAccounts();
      GetLandlordAccounts();
      console.log("bye");
  
    }

  const GetTenantAccounts = async () => {
    var temp_accounts = []
    console.log(config.params.email);
    const accounts = APIGetTenantAccounts(config.params.email);
    accounts.then((result) => {
      if (result !== undefined){
        for (let i=0;i<result.data.data.length;i++){
            temp_accounts.push(result.data.data[i]);
        }
      }
    console.log(temp_accounts)

    // Convert every tenant fetched to HTML to be shown on the left
    const tenant_html = temp_accounts.map(account => 
      <Box key={account.tenant_user_id}>
      <AccordionItem p="0">
          <AccordionButton justifyContent="space-between">
              <HStack width="100%">
              <Box textAlign='left' width='25em'>
              {account.email}
              </Box>
              <Box textAlign='left' width='53em'>
              {account.public_lease_id}
              </Box>
              <Box textAlign='left' width='20.5em'>
              {account.public_building_id}
              </Box>
              </HStack>
              <AccordionIcon width='2em'/>
              <Box >
                <Popup trigger={<IconButton size='sm' icon={<DeleteIcon />} />} position="left center">
                  <FormControl>
                    <Button 
                      onClick={() => APIDeleteTenantByEmail(account.email)}
                      colorScheme='red'
                      >
                      confirm?
                    </Button>
                  </FormControl>
                </Popup>
              </Box>
          </AccordionButton>
          <AccordionPanel>
              <HStack spacing='24vw'>
              <Box>
              Lease ID: {account.public_lease_id} <br></br>
              Floor: {account.floor} <br></br>
              Unit: {account.unit_number} <br></br>
              </Box>
              </HStack>
              <br></br>
              <Button onClick={() => navigateToLeaseUploadPage(account.tenant_user_id)} bgColor='blue.500' color='white' _hover={{bg: 'blue.800'}}>
                  New Lease
              </Button>
              <Button onClick={() => navigateToViewLeasePage(account.tenant_user_id)} bgColor='blue.500' color='white' _hover={{bg: 'blue.800'}} marginLeft="2em">
                  View Lease
              </Button>
          </AccordionPanel>
      </AccordionItem>
      </Box>
    );
    
    setTenantAccounts(tenant_html) 
  })}

  const GetLandlordAccounts = async () => {
    var temp_accounts = []
    console.log(config.params.email);
    const accounts = APIGetLandlordAccounts(config.params.email);
    accounts.then((result) => {
      if (result !== undefined){
        for (let i=0;i<result.data.data.length;i++){
            temp_accounts.push(result.data.data[i]);
        }
      }
    console.log(temp_accounts)

    // Convert every landlord fetched to HTML to be shown on the left
    const landlord_html = temp_accounts.map(account => 
      <Box key={account.landlord_user_id}>
      <AccordionItem p="0">
          <AccordionButton justifyContent="space-between">
              <HStack width="100%">
              <Box textAlign='left' width='25em'>
              {account.email}
              </Box>
              <Box textAlign='left' width='26em'>
              {account.ticket_type}
              </Box>
              <Box textAlign='left' width='26em'>
              {account.role}
              </Box>
              <Box textAlign='left' width='23em'>
              {account.public_building_id}
              </Box>
              </HStack>
              <AccordionIcon width='2em'/>
              <Box  >
                <Popup trigger={<IconButton size='sm' icon={<DeleteIcon />} />} position="left center">
                  <FormControl>
                    <Button 
                      onClick={() => APIDeleteLandlordByEmail(account.email)}
                      colorScheme='red'
                      >
                      confirm?
                    </Button>
                  </FormControl>
                </Popup>
              </Box>
          </AccordionButton>
          <AccordionPanel>
              <HStack spacing='24vw'>
              <Box>
              Lease ID:  <br></br>
              Floor:  <br></br>
              Unit:  <br></br>
              </Box>
              </HStack>
              <br></br>
          </AccordionPanel>
      </AccordionItem>
      </Box>
    );
    
    setLandlordAccounts(landlord_html) 
  })}

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
    if (authenticate()){
      getLandlordRole(config.params.email);
      GetTenantAccounts();
      GetLandlordAccounts();}
    }
    ,
  []);






  // Ensure that user is authenticated for all renders
  useEffect(() => {
      authenticate()
  })

  return (
    <>
    <ChakraProvider theme={customTheme}>
      <CSSReset/>
      {NavigationBar()}
      
      {AccountManagementTable(() => APIDeleteAllTenants(config.params.email), "Tenant", tenantAccounts)}
      {AccountManagementTable(() => APIDeleteAllLandlords(config.params.email), "Landlord", landlordAccounts, landlordRole)}

      
    </ChakraProvider>


    </>
  );
};
export default AccountManagement