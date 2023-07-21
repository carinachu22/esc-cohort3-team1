// Import react-bootstrap components

import { Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";

// Import React and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";
import NavigationBar from '../components/NavigationBar';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, TableContainer, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
Box, AccordionIcon, HStack, Card, CardBody, Spacer, Flex } from '@chakra-ui/react';

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
export default function Dashboard() {
    // Initialise states and hooks
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [needAction, setNeedAction] = useState(0);
    const [waitAction, setWaitAction] = useState(0);
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const userDetails = useAuthUser();
    const tenant_need_action = ['landlord_completed_work','landlord_quotation_sent'];
    const tenant_wait_action = ['tenant_ticket_created', 'ticket_quotation_approved','landlord_started_work']
    const landlord_need_action = ['tenant_ticket_created', 'landlord_quotation_required', 'ticket_quotation_approved']
    const landlord_wait_action = ['landlord_started_work']

    // Initialise function for 1. Fetch all service tickets dependent on user type (tenant or landlord)
    const GetServiceTickets = (userDetails) => {
        if (userDetails() == undefined){
            return;
        }
        const type = userDetails().type;
        let response;
    
        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
            setError("");
            //console.log('type',type)
            try{
                const config = {
                    headers: {
                      Authorization: `${token()}`
                    },
                    params: {
                        email: userDetails().email
                    }
                }
                if (type == 'landlord'){
                    response = await axios.get(
                        "http://localhost:5000/api/landlord/getTickets",
                        config
                    )
                } else if (type == 'tenant'){ 
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
                    setError(err.response);
                }
                else if (err && err instanceof Error){
                    setError(err.message);
                }
                console.log("Error: ", err);
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
                    if (userDetails().type == 'tenant'){
                        if (tenant_need_action.includes(result[i].status)){
                            setNeedAction(needAction+1);
                        }
                        else if (tenant_wait_action.includes(result[i].status)){
                            setWaitAction(waitAction+1);
                        }
                    } else if (userDetails().type == 'landlord'){
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
            setLoading(false);
        })
    }

    const authenticate = (() => {
        // Check if still autenticated based on react auth kit
        if (!authenticated()){
            console.log("Not authenticated, redirecting.")
            return <Navigate to="/"></Navigate>
        }
    })

    // This is to ensure that the GET request only happens once on page load
    // This will update the tickets state
    useEffect(() => {
        GetServiceTickets(userDetails);
        authenticate();},
        [])


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
        <h1>
            Welcome, {userDetails().email}
        </h1>
        <Flex>
            <Spacer/>
        <Card width='300px'>
            <CardBody>
                You have {tickets.length} tickets <br></br>
            </CardBody>
        </Card>
        <Spacer/>
        <Card width='300px'>
        <CardBody>
        You have {needAction} tickets requiring your attention. <br></br>
        </CardBody>
        </Card>
        <Spacer/>
        <Card width='300px'>
        <CardBody>
        You have {waitAction} tickets pending your tenant's/landlord's attention.
        </CardBody>
        </Card>
        <Spacer/>
        </Flex>
        </>
    )
}
