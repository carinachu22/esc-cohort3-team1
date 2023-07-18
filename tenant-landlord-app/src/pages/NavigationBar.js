import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { Link } from 'react-router-dom';

function NavigationBar() {
    const signOut = useSignOut();
    const userDetails = useAuthUser();
    // var email = userDetails().email;

    return (
        <Flex bg="blue.500" color="white" p={4} align="center" justifyContent="space-between">
            {/* <Text fontSize="xl">Welcome, {email}</Text> */}
            <Box w="100%" d="flex" align="center" justifyContent="space-between">
                <Link to="/pages/Dashboard/">
                    <Button colorScheme="whiteAlpha" mr={2}>Homepage</Button>
                </Link>
                <Link to="/pages/CreateTicketPage/">
                    <Button colorScheme="whiteAlpha" mr={2}>Create Service Ticket</Button>
                </Link>
                <Link to="/pages/SearchTicketPage/">
                    <Button colorScheme="whiteAlpha" mr={2}>Search for Service Ticket</Button>
                </Link>
                <Button colorScheme="whiteAlpha" onClick={() => signOut()}>
                    Sign out
                </Button>
            </Box>
            <Spacer />
        </Flex>
    );
}

export default NavigationBar;
