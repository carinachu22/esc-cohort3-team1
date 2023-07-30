import React, { useState } from 'react';
import { Box, Button, Heading, Textarea, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { Formik, Form,useFormik } from 'formik';
import axios, { AxiosError } from "axios";
import NavigationBar from '../components/NavigationBar.js';



function CreateTicketPage() {
  const navigate = useNavigate();
  const token = useAuthHeader();
  const userDetails = useAuthUser();
  const [tenantComment, setTenantComment] = useState('');
  const [ticketType, setTicketType] = useState('');
  const toast = useToast();

  const handleCommentChange = (event) => {
    setTenantComment(event.target.value);
  };

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  // const handleAdditionalHeadingChange = (event) => {
  //   setAdditionalHeading(event.target.value);
  // };

  const handleCreateTicket = async () => {
    console.log(tenantComment);
    console.log(token());

    try {
      const config = {
        headers: {
          Authorization: `${token()}`,
        },
      };
      const currentdate = new Date();
      const values = {
        name: '--',
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

      const response1 = await axios.post(
        'http://localhost:5000/api/tenant/createTicket',
        values,
        config
      );
      console.log('got response of creating ticket:');
      console.log(response1);

      navigate('/pages/Dashboard'); // Navigate to the Dashboard form page
      toast({
        title: "Ticket Created",
        description: "Ticket has been created.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
    } catch (err) {
      if (err && err instanceof AxiosError) {
        console.log('Error: ', err);
      } else if (err && err instanceof Error) {
        console.log('Error: ', err);
      }

      
    }
  };

  const formik = useFormik({
    initialValues: {
      location: '',
      category: '',
      tenantComment: '',
    },
    onSubmit: handleCreateTicket,
  });

  return (
    <>
    {NavigationBar()}
    <Formik
    initialValues={{
      location: '',
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
            Location
          </Heading>
          <Textarea
            name="location"
            placeholder="Enter location"
            value={formik.values.location}
            onChange={formik.handleChange}
            marginBottom="2em"
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Category Of Request
          </Heading>
          <Textarea
            name="category"
            placeholder="Enter category"
            value={ticketType}
            onChange={handleTicketTypeChange}
            marginBottom="1em"
          />
        </Box>

        {/* Comment Box 3 */}
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