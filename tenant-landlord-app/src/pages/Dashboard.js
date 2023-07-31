// Import react-bootstrap components

import { Navigate, useNavigate } from 'react-router-dom';

// Import React and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";
import NavigationBar from '../components/NavigationBar.js';
import { Box, Flex } from '@chakra-ui/react';

import {
    chakra,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
  } from '@chakra-ui/react'
import { AiFillInfoCircle, AiFillClockCircle } from "react-icons/ai/index.esm.js";
import { BiSolidError } from "react-icons/bi/index.esm.js";

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
export default function Dashboard() {
    // Initialise states and hooks
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [needAction, setNeedAction] = useState(0);
    const [waitAction, setWaitAction] = useState(0);
    const [loggedin, setLoggedin] = useState(false);
    const [email, setEmail] = useState("");
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const userDetails = useAuthUser();
    const tenant_need_action = ['landlord_completed_work','landlord_quotation_sent'];
    const tenant_wait_action = ['tenant_ticket_created', 'ticket_quotation_approved','landlord_started_work']
    const landlord_need_action = ['tenant_ticket_created', 'landlord_quotation_required', 'ticket_quotation_approved']
    const landlord_wait_action = ['landlord_started_work']

    // Initialise function for 1. Fetch all service tickets dependent on user type (tenant or landlord)
    const GetServiceTickets = (userDetails) => {
        if (userDetails() === undefined){
            return;
        }
        const type = userDetails().type;
        let response;
    
        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
            try{
                const config = {
                    headers: {
                      Authorization: `${token()}`
                    },
                    params: {
                        email: userDetails().email
                    }
                }
                if (type === 'landlord'){
                    response = await axios.get(
                        "http://localhost:5000/api/landlord/getTickets",
                        config
                    )
                } else if (type === 'tenant'){ 
                    response = await axios.get(
                        "http://localhost:5000/api/tenant/getTickets",
                        config
                    )
                }
                console.log("got response:")
                console.log(response);
                return response.data.data;
            } catch (err){
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
        const temp_tickets = [];
        // Wait for promise to be fulfilled (fetching tickets from database)
        test_tickets.then(function(result){
            console.log('result',result)
            // Naive data validation
            if (result !== undefined){
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
                setTickets(temp_tickets)
            }   

            // Update states to be accessed in return
        })
    }

    const authenticate = () => {
        // Check if still autenticated based on react auth kit
        const temp_user = userDetails();
        if (!authenticated()){
            console.log("Not authenticated, redirecting.")
            return false
        } else {
            setLoggedin(true);
            setEmail(temp_user.email);
            return true
        }
    }

    // This is to ensure that the GET request only happens once on page load
    // This will update the tickets state
    useEffect(() => {
        if (authenticate()){
            GetServiceTickets(userDetails);
        } else {
            navigate('/')
        }
        }, [])

    useEffect(() => {
        authenticate()
    })



    //console.log("Authenticated.")
    // Warning from react comes from the below block
    // This is because the number of hooks called before and after loading is different
    // If promise is not yet fulfilled, wait
    /*
    if (isLoading){
        return<div className="App">Loading...</div>;
    }*/
    return (
        <>
        {NavigationBar()}
        <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
        Welcome, {email}
        </chakra.h1>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            {StatsCard('Total Tickets', tickets.length, <AiFillInfoCircle size={'3em'} color='lightblue' />)}
            {StatsCard('Tickets Requiring Your Attention', needAction, <BiSolidError size={'3em'} color='orange' />)}
            {StatsCard('Tickets Pending Your Tenant/Landlord Action', waitAction, <AiFillClockCircle size={'3em'} color='grey' />)}
        </SimpleGrid>
        </Box>
        </>
    )
    
}


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