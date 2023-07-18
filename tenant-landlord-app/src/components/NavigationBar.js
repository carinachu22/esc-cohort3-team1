import {
    Box,
    Flex,
    Text,
    Button,
    Link,
    HStack,
    Spacer,
} from '@chakra-ui/react';
  
import * as React from 'react'; 
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { Navigate, useNavigate } from 'react-router-dom';

function CreateTicket({accountType}){
    if (accountType == 'landlord'){
        return null
    }
    return (
        <Box style={{  
            margin: 'auto'
            }}>
            <Link href="/pages/CreateTicketPage/" color='white'>
                Create Service Ticket
            </Link>
        </Box>
    )
}

function AccountManagement({accountType}){
    if (accountType == 'tenant'){
        return null
    }
    return (
        <Box style={{  
            margin: 'auto'
            }}>   
            <Link href="/pages/AccountManagement" color='white'>
                Account Management
            </Link>
        </Box>
    )
}

export default function NavigationBar(){
    const navigate = useNavigate();
    const signOut = useSignOut();
    const userDetails = useAuthUser();
    if (userDetails() == null){
        return <Navigate to="/"></Navigate>
    }
    return (
        <>
        <Flex className="Navbar" bg="blue.500">
            <HStack spacing='24px'>
            <Box style={{  
                margin: 'auto'
                }}>
                <Text fontSize='50px' style={{margin: 'auto', color: 'white'}}>
                    Service Ticket Portal
                </Text>
            </Box>
            <Box style={{  
                margin: 'auto'
                }}>
                <Link href="/pages/Dashboard/" color='white'>
                    Homepage
                </Link>
            </Box>
            <Box style={{  
                margin: 'auto'
                }}>
                <Link href="/pages/TicketList" color='white'>
                    Service Ticket List
                </Link>
            </Box>
            <CreateTicket accountType={userDetails().type}/>
            <AccountManagement accountType={userDetails().type}/>
            </HStack>
            <Spacer />
            <Box style={{  
                margin: 'auto'
                }}>
                <Button onClick={() => "signOut();navigate('/')"} bgColor='blue.600' color='white' _hover={{bg: 'blue.800'}}>
                    Sign Out
                </Button>
            </Box>
        </Flex>
        </>
    )
}
