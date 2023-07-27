// Import react-bootstrap components

import { useEffect } from 'react';

// Import React and hooks
// import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';


// Import axios for http requests
import NavigationBar from '../components/NavigationBar.js';
import { Accordion, 
    AccordionButton, 
    AccordionItem, 
    AccordionPanel, 
    TableContainer, 
    Table,
    Thead,
    Tr,
    Th,
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
    IconButton, } from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons'

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const AccountManagement = () => {
  const navigate = useNavigate();
  const [tenantAccounts, setTenantAccounts] = useState(null)
  const { onOpen, onClose, isOpen } = useDisclosure()

  const navigateToTenantCreationPage = () => {
    navigate('/pages/TenantCreationPage');
  }



  const APIGetTenantAccounts = async () => {
    const response = await axios.get(
        "http://localhost:5000/api/landlord/getTenantAccounts",
    )
    //console.log(response)
    return response
  }
  
  const APIDeleteAllTenants = async () => {
    const response = await axios.patch(
        "http://localhost:5000/api/landlord/deleteAllTenants",
    )
    //console.log(response)
    GetTenantAccounts();
    onClose();
    return response
  }

  const GetTenantAccounts = () => {
    var temp_accounts = []
    const accounts = APIGetTenantAccounts()
    accounts.then((result) => {
        if (result !== undefined){
        for (let i=0;i<result.data.data.length;i++){
            temp_accounts.push(result.data.data[i]);
        }
    }
    console.log(temp_accounts)

    // Convert every tenant fetched to HTML to be shown on the left
    const tenant_html = temp_accounts.map(account => 
      <div key={account.tenant_user_id}>
      <AccordionItem>
          <AccordionButton justifyContent="space-between">
              <HStack width="100%">
              <Box textAlign='left' width="15vw" marginStart="2">
              {account.tenant_user_id}
              </Box>
              <Box textAlign='left' width='34vw'>
              {account.email}
              </Box>
              <Box textAlign='left' width='34vw'>
              {"Date Created"}
              </Box>
              </HStack>
              <AccordionIcon width='2.3vw'/>
          </AccordionButton>
          <AccordionPanel>
              <HStack spacing='24vw'>
              <Box>
              Tenant ID: {account.tenant_user_id} <br></br>
              Email: {account.email} <br></br>
              </Box>
              </HStack>
              <br></br>
          </AccordionPanel>
      </AccordionItem>
      </div>
    );
    
    setTenantAccounts(tenant_html) 
  })}

  useEffect(() => {
    GetTenantAccounts()},
    [])

  

    
  return (
    <>
    {NavigationBar()}
    <Button
      onClick={navigateToTenantCreationPage}
      backgroundColor="teal.400" 
      variant="unstyled"
      padding={2}
      position="fixed"
      right="6"
      marginTop="2"
      textColor="white"
    >
    Create New Tenant
    </Button>
    <TableContainer marginTop="20" margin={20} border="1px" borderColor="gray.300" >
        <Table variant='simple'>
        <Thead margin={0}>
            <Tr>
                <Th width="16vw" textAlign='left' paddingRight={0} > ID </Th>
                <Th width='30vw' textAlign='left' paddingRight={0} paddingLeft={0}> Tenant </Th>
                <Th width='33vw' textAlign='left' paddingRight={0} paddingLeft={0}>Date Created</Th>
                <Th width='2.5vw' alignItems="center" paddingRight={0} paddingLeft={0}>
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
                    <PopoverContent>
                      <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        Delete All Users
                      </PopoverBody>
                      <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                          <Button variant='outline' onClick={onClose}>Cancel</Button>
                          <Button colorScheme='red' onClick={APIDeleteAllTenants} >Confirm</Button>
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


    </>
  );
};
export default AccountManagement