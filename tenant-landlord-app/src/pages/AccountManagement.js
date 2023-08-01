// Import react-bootstrap components

import { Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";
import { useEffect } from 'react';
import Popup from 'reactjs-popup';

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
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    ButtonGroup,
    useDisclosure,
    IconButton,
    FormControl,
    extendTheme,
    CSSReset,
    ChakraProvider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabbel,
    FormHelperText} from '@chakra-ui/react';

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
  const { onOpen: onOpen, onClose: onClose, isOpen: isOpen } = useDisclosure();
  const { onOpen: onOpenModal, onClose: onCloseModal, isOpen: isOpenModal } = useDisclosure();
  const token = useAuthHeader();
  const userDetails = useAuthUser();

  console.log('user details', userDetails)

  const config = {
    headers: {
      Authorization: `${token()}`
    },
    params: {
        email: userDetails().email,
    }
  }

  const customTheme = extendTheme({
    styles: {
      global: {
        body: {
          bg: "gray.200", // Set the desired background color here
        },
      },
    },
  });

  // const APIGetLeaseDetails = async (tenant_user_id) => {
  //   console.log("user id", tenant_user_id)
  //   const response = await axios.get(
  //       "http://localhost:5000/api/landlord/getLeaseDetails?tenantUserId=" + tenant_user_id
  //   )
  //   console.log("get lease res", response);
  //   console.log(response.data.data.lease_id)
  //   return response.data.data.lease_id
  // }



  const navigateToTenantCreationPage = () => {
    navigate('/pages/TenantCreationPage');
  }

  const navigateToViewLeasePage = (tenantID) => {
    navigate('/pages/ViewLeasePage/', { state: { tenantID } } );
  }

  const navigateToLeaseUploadPage = (tenantID) => {
    navigate('/pages/LeaseUploadPage/', { state: { tenantID } } );
  }

  const APIGetTenantAccounts = async (email) => {
    const response = await axios.get(
        "http://localhost:5000/api/landlord/getTenantAccounts?landlordEmail=" + email,
        config
    )
    console.log("APIGetTenantAccounts", response)
    return response
  }
  
  const APIDeleteAllTenants = async (email) => {
    const response = await axios.patch(
        "http://localhost:5000/api/landlord/deleteAllTenants?landlordEmail=" + email,{
          headers: {
            Authorization: `${token()}`
          }
        }
    )
    //console.log(response)
    GetTenantAccounts();
    onClose();
  }


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
    console.log(email);
    GetTenantAccounts();
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
              {/* <Box textAlign='left' width="15vw" marginStart="2">
              {account.tenant_user_id}
              </Box> */}
              <Box textAlign='left' width='30em'>
              {account.email}
              </Box>
              <Box textAlign='left' width='30em'>
              {account.public_building_id}
              </Box>
              <Box textAlign='left' width='30em'>
              {account.public_lease_id}
              </Box>
              </HStack>
              <AccordionIcon width='2em'/>
              <Box width='5em' >
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
                {/* <IconButton size='sm' icon={<DeleteIcon />} onClick={onOpen}></IconButton>
                <Modal isOpen={isOpen} onClose={onClose} >
                  <ModalOverlay/>
                  <ModalContent>
                    <ModalHeader>
                      <ModalCloseButton/>
                    </ModalHeader>
                    <ModalBody>
                      <Box>Doing so will permanently delete this account, are you sure?</Box>
                    </ModalBody>
                    <ModalFooter>
                      <Button onClick={() => APIDeleteTenantByEmail(account.email)} colorScheme='red'> </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal> */}
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


  useEffect(() => {
    GetTenantAccounts()},
    [])

  return (
    <>
    <ChakraProvider theme={customTheme}>
      <CSSReset/>
      {NavigationBar()}
      <Box position="relative" marginTop="2em" float="right" right="2em">
        <Button
          onClick={navigateToTenantCreationPage}
          colorScheme='teal'
          padding={2}

          textColor="white"
        >
        Create New Tenant
        </Button>
      </Box>
      <Box  fontSize="30px" marginLeft="2.6em" marginTop="2em" marginBottom="-2.5em">
        Tenant Details
      </Box> 
      <TableContainer  margin="5em" border="1px" borderColor="gray.300" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)" background="white">
        <Table variant='simple'>
        <Thead margin={0} backgroundColor="blue.400" width="100%">
            <Tr>
                {/* <Th width="15vw" textAlign='left' paddingRight={0} textColor="white"> ID </Th> */}
                <Th width='25em' textAlign='left' paddingRight={0} paddingLeft={4} textColor="white"> Email </Th>
                <Th width='25em' textAlign='left' paddingRight={0} paddingLeft={0} textColor="white">Building ID</Th>
                <Th width='35em' textAlign='left' paddingRight={0} paddingLeft={0} textColor="white">Current Lease</Th>
                <Th width='3.5em' alignItems="center" paddingRight={0} paddingLeft={0} >
                  <Popover
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    placement='left'
                    closeOnBlur={false}
                  >
                    <PopoverTrigger >
                      <IconButton size='sm' icon={<DeleteIcon />} />
                    </PopoverTrigger>
                    <PopoverContent >
                      <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        Delete All Users
                      </PopoverBody>
                      <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                          <Button variant='outline' onClick={onClose}>Cancel</Button>
                          <Button colorScheme='red' onClick={() => APIDeleteAllTenants(config.params.email)} >Confirm</Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </Th>
            </Tr>
        </Thead>
        </Table>
        <Accordion allowToggle >
          {tenantAccounts}
        </Accordion>
      </TableContainer>
    </ChakraProvider>





    </>
  );
};
export default AccountManagement