// Import React and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, { AxiosError } from "axios";

// Import NavigationBar component
import NavigationBar from '../components/NavigationBar.js';

// Import Chakra components
import {
    chakra,
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
  } from '@chakra-ui/react'

// Import icons
import { AiFillInfoCircle, AiFillClockCircle } from "react-icons/ai/index.esm.js";
import { BiSolidError } from "react-icons/bi/index.esm.js";

/**
 * Functional component to display dashboard.
 * 
 * Gets all tickets from database.
 * Counts and categorises tickets by action requirement of user.
 * Presents to the user a dashboard with statistics.
 * 
*/
export default function Dashboard() {
    // Initialise states and hooks
    const [tickets, setTickets] = useState([]);         // Initialise state to contain list of service tickets
    const [needAction, setNeedAction] = useState(0);    // Initialise state to count number of tickets requiring user action
    const [waitAction, setWaitAction] = useState(0);    // Initialise state to count number of tickets pending other users action
    const [email, setEmail] = useState("");             // Initialise state to display user's email
    const token = useAuthHeader();                      // Initialise hook to pass token in API call
    const authenticated = useIsAuthenticated();         // Initialise hook to check if valid sign in session
    const userDetails = useAuthUser();                  // Initialise hook to get user details, such as email
    const navigate = useNavigate();                     // Initialise hook to allow rerouting

    // Initialise variables to check status of service ticket
    // This is for the stepper (circle) to detect which status and step to show
    const tenant_need_action = ['landlord_completed_work','landlord_quotation_sent'];
    const tenant_wait_action = ['tenant_ticket_created', 'ticket_quotation_approved','landlord_started_work']
    const landlord_need_action = ['tenant_ticket_created', 'landlord_quotation_required', 'ticket_quotation_approved']
    const landlord_wait_action = ['landlord_started_work']

    // Initialise function to get all related tickets from database
    const GetServiceTickets = (userDetails) => {
        // Get user type, either "tenant" or "landlord"
        const type = userDetails().type;

        // Initialise variable first since response is conditional assignment
        let response;
    
        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
            try{
                // Initialise config header to pass token and other params through API call
                const config = {
                    headers: {
                      Authorization: `${token()}`
                    },
                    params: {
                        email: userDetails().email
                    }
                }
                // If user is a landlord, use landlord API call
                if (type === 'landlord'){
                    response = await axios.get(
                        "http://localhost:5000/api/landlord/getTickets",
                        config
                    )
                }
                // If user is a tenant, use tenant API call 
                else if (type === 'tenant'){ 
                    response = await axios.get(
                        "http://localhost:5000/api/tenant/getTickets",
                        config
                    )
                }
                // console.log("got response:")
                // console.log(response);
                return response.data.data;
            } catch (err){
                // Standard error catching
                if (err && err instanceof AxiosError) {
                    console.log("Error: ", err);
                }
                else if (err && err instanceof Error){
                    console.log("Error: ", err);
                }
            }
        }


        // Initialise promise
        const test_tickets = APIGetTickets(type)

        // Initialise temporary variable
        let temp_tickets = [];

        // Wait for promise of fetching tickets to be fulfilled
        test_tickets.then(function(result){
            // console.log('result',result)
            // Check if the API call succeeded
            if (result !== undefined){
                // For each ticket, push to the temp_tickets array
                // Then, check the status of the ticket and increment the appropriate counter based on user type
                for (let i=0;i<result.length;i++){
                    temp_tickets.push(result[i]);
                    if (userDetails().type === 'tenant'){
                        if (tenant_need_action.includes(result[i].status)){
                            setNeedAction(needAction+1);
                        }
                        else if (tenant_wait_action.includes(result[i].status)){
                            setWaitAction(waitAction+1);
                        }
                    } else if (userDetails().type === 'landlord'){
                        if (landlord_need_action.includes(result[i].status)){
                            setNeedAction(needAction+1);
                        }
                        else if (landlord_wait_action.includes(result[i].status)){
                            setWaitAction(waitAction+1);
                        }
                    }
                }
                // Set state so that tickets.length can be read in the render
                setTickets(temp_tickets)
            }   
        })
    }

    // Initialise function for displaying statistics to user
    function StatsCard(title, stat, icon) {
        //const { title, stat, icon } = props
        return (
          <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <Flex justifyContent={'space-between'}>
              <Box pl={{ base: 2, md: 4 }}>
                <StatLabel fontWeight={'medium'} isTruncated>
                  {title}
                </StatLabel>
                <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                  {stat}
                </StatNumber>
              </Box>
              <Box
                my={'auto'}
                color={useColorModeValue('gray.800', 'gray.200')}
                alignContent={'center'}>
                {icon}
              </Box>
            </Flex>
          </Stat>
        )
    }

    // Initialise authenticate function
    // Redirects to index page if not authenticated
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


    // API Call only happens on page load and after authentication check
    useEffect(() => {
        if (authenticate()){
            GetServiceTickets(userDetails);
            setEmail(userDetails().email);
        }}, 
        [])

    // Check user authentication on every render
    useEffect(() => {
        authenticate()
    })

    if (userDetails().type === 'tenant'){
        return (
            <>
            {NavigationBar()}
            <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1 id="emailText" textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
                    Welcome, {email}
                </chakra.h1>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                    {StatsCard('Total Tickets', tickets.length, <AiFillInfoCircle size={'3em'} color='lightblue' />)}
                    {StatsCard('Tickets Requiring Your Attention', needAction, <BiSolidError size={'3em'} color='orange' />)}
                    {StatsCard('Tickets Pending Your Landlord\'s Action', waitAction, <AiFillClockCircle size={'3em'} color='grey' />)}
                </SimpleGrid>
            </Box>
            </>
        )
    } else {
        return (
            <>
            {NavigationBar()}
            <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1 id="emailText" textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
                    Welcome, {email}
                </chakra.h1>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                    {StatsCard('Total Tickets', tickets.length, <AiFillInfoCircle size={'3em'} color='lightblue' />)}
                    {StatsCard('Tickets Requiring Your Attention', needAction, <BiSolidError size={'3em'} color='orange' />)}
                    {StatsCard('Tickets Pending Your Tenant\'s Action', waitAction, <AiFillClockCircle size={'3em'} color='grey' />)}
                </SimpleGrid>
            </Box>
            </>
        )
    }
}


