import React, { useState, useEffect } from 'react';
import { Box, Heading, Textarea, Input, useToast, Select, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

import NavigationBar from '../components/NavigationBar.js';
import CheckTicket from '../components/CheckTicket.js';

/**
 * 1. Gets details of ticket by ID
 * 2. Captures changes to details through inputs
 * 3. Modifies ticket on button click
 */

export default function ModifyTicketPage() {
    const navigate = useNavigate();
    const token = useAuthHeader();
    const userDetails = useAuthUser();
    const [ticketType, setTicketType] = useState('');           // Initialise state to contain selected ticket type
    const [additionalHeading, setAdditionalHeading] = useState('');
    const [tenantComment, setTenantComment] = useState('');     // Initialise state to contain comment text
    const [showOtherInput, setShowOtherInput] = useState(false);    // Initialise state to check if "Others" text field should be shown
    const [otherRequestType, setOtherRequestType] = useState('');   // Initialise state to contain "Others" request type
    const [ticketDateTime, setTicketDateTime] = useState('');
    const [publicServiceRequestID, setPublicRequestID] = useState('')
    const [status, setstatus] = useState('');
    const [ticket, setTicket] = useState('');
    const location = useLocation();
    const toast = useToast();
    var ticketID;
    if (location.state != null){
        ticketID = location.state.ticketID;
    }
    console.log('ID', ticketID)
    console.log("userdetails", userDetails());
    const authenticated = useIsAuthenticated();

    const convertStatus = (status) => {
        if (status === 'tenant_ticket_created'){
            return 'Created'
        } else if (status === 'landlord_ticket_rejected'){
            return 'Rejected By Landlord'
        } else if (status === 'landlord_ticket_approved'){
            return 'Approved By Landlord'
        } else if (status === 'landlord_quotation_sent'){
            return 'Quotation Sent By Landlord'
        } else if (status === 'ticket_quotation_approved'){
            return 'Quotation Approved By Tenant'
        } else if (status === 'ticket_quotation_rejected'){
            return 'Quotation Rejected By Tenant'
        } else if (status === 'landlord_started_work'){
            return 'Work Started By Landlord'
        } else if (status === 'landlord_completed_work'){
            return 'Work Completed By Landlord'
        } else if (status === 'ticket_work_rejected') {
            return 'Work Rejected by Tenant'
        } else if (status === 'landlord_ticket_closed' || status === 'tenant_feedback_given'){
            return "Closed"
        }
    }

    
    const handleRequestTypeChange = (event) => {
        const selectedType = event.target.value;
        setTicketType(selectedType);
        setShowOtherInput(selectedType === 'Others');
    };

    const handleOtherRequestTypeChange = (event) => {
        setOtherRequestType(event.target.value);
    };

    const GetServiceTickets = (userDetails) => {
        if (userDetails() === undefined){
            return;
        }
        const type = userDetails().type;
        const tickets = [];
        let response;

        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
            console.log('type',type)
            console.log(ticketID)
            try{
                const config = {
                    headers: {
                    Authorization: `${token()}`
                    },
                    params: {
                        email: userDetails().email,
                        id: ticketID
                    }
                }
                response = await axios.get(
                    `http://localhost:5000/api/admin/getTicketById/`,
                    config
                )
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
    const ticket = APIGetTickets(type)
    // Wait for promise to be fulfilled (fetching tickets from database)
    ticket.then(function(result){
        console.log('result',result)
        // Naive data validation
        if (result !== undefined){
            tickets.push(result);
        }   
        console.log('tickets',tickets)
        var tenantComment = tickets[0].request_description;
        var category = tickets[0].ticket_type;
        setPublicRequestID(tickets[0].public_service_request_id)
        setstatus(convertStatus(tickets[0].status))
        var timesubmitted = tickets[0].submitted_date_time;
        var floor = tickets[0].floor;
        var unit_number = tickets[0].unit_number;
        setTicketDateTime(tickets[0].submitted_date_time)
        setTicket(tickets[0])
        formik.setValues({
          floor: floor,
          unit_number: unit_number,
          category: category,
          tenantComment: tenantComment,
          status: status,
          timesubmitted: timesubmitted,
        });
    })
}

    const formik = useFormik({
        initialValues: {
            floor: '',
            unit_number: '',
            category: '',
            tenantComment: '',
            status: '',
            timesubmitted: '',
        },
        onSubmit: {},
    });

    // Initialise function to call API with modified ticket details
    const handleModifyTicket = async () => {

        try {
            // Initialise config header to pass token and other params through API call
            const config = {
                headers: {
                    Authorization: `${token()}`,
                },
            };
            var values = {}                 
            // Initialise values object to hold ticket deatils
            // Set values based on ticket type
            if (ticketType === 'Others' ){
                values = {
                    public_service_request_id: publicServiceRequestID,
                    ticket_type: ticketType + ' - ' + otherRequestType,
                    request_description: formik.values.tenantComment,
                    status: formik.values.status,
                };
            } else {
                values = {
                    public_service_request_id: publicServiceRequestID,
                    ticket_type: ticketType,
                    request_description: formik.values.tenantComment,
                    status: formik.values.status,
                };
            }
            console.log(values['ticket_type'])
            console.log(values['ticket_type'].slice(0,6))
            const response1 = await axios.patch(
                'http://localhost:5000/api/admin/modifyTicket',
                values,
                config
            );
            console.log('got response of modifying ticket:');
            console.log(response1);
            toast({
                title: "Ticket Modified",
                description: "Ticket has been modified.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            navigate(-1); // Navigate back to viewing tikcet
        } catch (err) {
            // Standard error catching
            if (err && err instanceof AxiosError) {
                console.log('Error: ', err);
            } else if (err && err instanceof Error) {
                console.log('Error: ', err);
            }      
        }};

  
    useEffect(() => {
        if (authenticate()){
            GetServiceTickets(userDetails);
        }
    }, [status, navigate]);


    // Ensure that user is authenticated for all renders
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
        authenticate()
    })


    return (
    <>
    {NavigationBar()}

    <Box
      className='main container'
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="50vh"
      fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      marginTop="5vh"
    >
      {/* Title */}
      <Heading as="h4" size="2xl" marginBottom="1em">
        Your Service Ticket
      </Heading>

      {/* Comment Boxes */}
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="2em">
        {/* Comment Box 1 */}
        <Box flex="1" marginRight="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Floor
          </Heading>
          <Textarea 
            readOnly
            name="floor"
            marginBottom="2em"
            value={formik.values.floor}
            onChange={formik.handleChange}
          />
        {/* Comment Box 1 */}
        <Box flex="1" marginRight="2em">
            <Heading as="h5" size="lg" marginBottom="1em">
                Request Type
            </Heading>
            <Select
                name="requestType"
                placeholder="Select request type"
                value={ticketType}
                onChange={handleRequestTypeChange}
                marginBottom="2em"
            >
            <option value="Aircon">Aircon</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Admin">Admin</option>
            <option value="Others">Others</option>
            </Select>
            {showOtherInput && (
            <Input
              name="otherRequestType"
              placeholder="Enter other request type"
              value={otherRequestType}
              onChange={handleOtherRequestTypeChange}
              marginBottom="1em"
            />
          )}
        </Box>
            <Heading as="h5" size="lg"  marginBottom="1em">
                Status
            </Heading>
            <Select
                name="status"
                placeholder="Select ticket status"
                value={formik.values.status}
                onChange={formik.handleChange}
                marginBottom="1em"
            >
            <option value="tenant_ticket_created">Created</option>
            <option value="landlord_ticket_rejected">Rejected By Landlord</option>
            <option value="landlord_ticket_approved">Approved By Landlord</option>
            <option value="landlord_quotation_sent">Quotation Sent By Landlord</option>
            <option value="ticket_quotation_approved">Quotation Approved By Tenant</option>
            <option value="ticket_quotation_rejected">Quotation Rejected By Tenant</option>
            <option value="landlord_started_work">Work Started By Landlord</option>
            <option value="landlord_completed_work">Work Completed By Landlord</option>
            <option value="ticket_work_rejected">Work Rejected By Tenant</option>
            <option value="landlord_ticket_close">Closed</option>
            </Select>
        </Box>

        {/* Comment Box 2 */}
        <Box flex="1" marginLeft="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Unit Number
          </Heading>
          <Textarea 
            readOnly
            name="unit_number"
            marginBottom="2em"
            value={formik.values.unit_number}
            onChange={formik.handleChange}
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Description
          </Heading>
          <Textarea 
            name="tenantComment"
            placeholder="Enter your comment"
            value={formik.values.tenantComment}
            onChange={formik.handleChange}
            marginBottom="1em"
            rows={8}
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Time Submitted
          </Heading>
          <Input
            name="Submitted time"
            value={formik.values.timesubmitted}
            marginBottom="2em"
          />
        </Box>
      </Box>

      {/* Submit Ticket Button */}

    </Box>
    <Box className='bottom container' justifyContent="center" display="flex">
        <Button
        variant="solid"
        colorScheme="blue"
        onClick={() => 
        handleModifyTicket(ticket.public_service_request_id, ticket.status)
        }
        width="13em"
        height="3em"
        marginTop="3em"
        borderRadius="0.25em"
        >
            Confirm Changes
        </Button>
    </Box>
    </>
  );
}

