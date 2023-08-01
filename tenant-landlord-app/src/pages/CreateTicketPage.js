// import React and hooks
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';

// import Formik module for forms
import { Formik, Form, useFormik } from 'formik';

// Import axios for http requests
import axios, { AxiosError } from "axios";

// import NavigationBar component
import NavigationBar from '../components/NavigationBar.js';

// Import Chakra components
import { Box, Text, Button, Heading, Textarea, FormControl, FormLabel, Input, Select, useToast } from '@chakra-ui/react';

/**
 * Functional component to display ticket creation page.
 * 
 * Displays form for user to input.
 * Captures input from user.
 * Sends API Post call on submit.
 * 
*/
function CreateTicketPage() {
    // Initialise states and hooks
    const [tenantComment, setTenantComment] = useState('');     // Initialise state to contain comment text
    const [ticketType, setTicketType] = useState('');           // Initialise state to contain selected ticket type
    const [additionalHeading, setAdditionalHeading] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);    // Initialise state to check if "Others" text field should be shown
    const [otherRequestType, setOtherRequestType] = useState('');   // Initialise state to contain "Others" request type
    const toast = useToast();                                       // Initialise hook to use toasts
    const token = useAuthHeader();                                  // Initialise hook to pass token in API call
    const authenticated = useIsAuthenticated();                     // Initialise hook to check if valid sign in session
    const userDetails = useAuthUser();                              // Initialise hook to get user details, such as email
    const navigate = useNavigate();                                 // Initialise hook to allow rerouting

    const handleCommentChange = (event) => {
        setTenantComment(event.target.value);
    };

    // const handleTicketTypeChange = (event) => {
    //   setTicketType(event.target.value);
    // };

    const handleRequestTypeChange = (event) => {
        const selectedType = event.target.value;
        setTicketType(selectedType);
        setShowOtherInput(selectedType === 'Others');
    };

    const handleOtherRequestTypeChange = (event) => {
        setOtherRequestType(event.target.value);
    };

    // Initialise function to call API with new ticket details
    const handleCreateTicket = async () => {
        console.log(tenantComment);
        console.log(token());

    try {
        // Initialise config header to pass token and other params through API call
        const config = {
            headers: {
                Authorization: `${token()}`,
            },
        };
        const currentdate = new Date();
        var values = {}                 // Initialise values object to hold ticket deatils
        // Set values based on ticket type
        if (ticketType === 'Others' ){
            values = {
            email: userDetails().email,
            request_type: ticketType + ' - ' + otherRequestType,
            request_description: tenantComment,
            additional_heading: additionalHeading,
            submitted_date_time:
                currentdate.getFullYear().toString() +
                '-' +
                (currentdate.getMonth() + 1).toString() +
                '-' +
                currentdate.getDate().toString() +
                ' ' +
                currentdate.getHours().toString() +
                ':' +
                ('0' + currentdate.getMinutes()).slice(-2) +
                ':' +
                currentdate.getSeconds().toString(),
            status: 'SUBMITTED',
            feedback_text: '',
            feedback_rating: '-1',
            };
        } else {
        values = {
        email: userDetails().email,
        request_type: ticketType,
        request_description: tenantComment,
        submitted_date_time:
          currentdate.getFullYear().toString() +
          '-' +
          (currentdate.getMonth() + 1).toString() +
          '-' +
          currentdate.getDate().toString() +
          ' ' +
          currentdate.getHours().toString() +
          ':' +
          ('0' + currentdate.getMinutes()).slice(-2) +
          ':' +
          currentdate.getSeconds().toString(),
        status: 'SUBMITTED',
        feedback_text: '',
        feedback_rating: '-1',
      };
        }
        console.log(values['request_type'])
        console.log(values['request_type'].slice(0,6))
        const response1 = await axios.post(
            'http://localhost:5000/api/tenant/createTicket',
            values,
            config
        );
        console.log('got response of creating ticket:');
        console.log(response1);
        if (response1.data.success === 0){
            toast({
                title: "Unable to create service ticket.",
                description: "No associated lease was found. Please contact your landlord.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        } else {toast({
              title: "Ticket Created",
              description: "Ticket has been created.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
          });
        }
        navigate('/pages/Dashboard'); // Navigate to the Dashboard form page
    } catch (err) {
        // Standard error catching
        if (err && err instanceof AxiosError) {
            console.log('Error: ', err);
        } else if (err && err instanceof Error) {
            console.log('Error: ', err);
        }      
    }};

    // Initialise formik with initial values
    const formik = useFormik({
        initialValues: {
            category: '',
            tenantComment: '',
        },
        onSubmit: handleCreateTicket,
    });

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

    // Ensure that user is authenticated for all renders
    useEffect(() => {
        authenticate()
    })
  return (
    <>
    {NavigationBar()}
    <Formik
    initialValues={{
      category: '',
      tenantComment: '',
    }}
    onSubmit={handleCreateTicket}
  >
    <Form>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      marginTop="5vh"
    >
      {/* Title */}
      <Heading as="h4" marginBottom="2em">
        Create A Service Ticket
      </Heading>


      {/* Comment Boxes */}
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="2em">
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

        {/* Comment Box 2 */}
        <Box flex="1" marginLeft="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Description
          </Heading>
          <Textarea
            name="tenantComment"
            placeholder="Enter your comment"
            value={tenantComment}
            onChange={handleCommentChange}
            marginBottom="1em"
            rows={8}
          />
          

        </Box>
      </Box>

      {/* Submit Ticket Button */}
      <Box>
        <Button
          variant="solid"
          colorScheme="blue"
          onClick={formik.handleSubmit}
          width="15em"
          height="3em"
          marginTop="3em"
          borderRadius="0.25em"
        >
          Submit
        </Button>
      </Box>
    </Box>
    </Form>
    </Formik>
    </>
  );
}

export default CreateTicketPage;