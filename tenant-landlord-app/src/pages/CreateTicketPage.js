import React, { useState } from 'react';
import { Box, Text, Button, Textarea, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import axios, {AxiosError} from "axios";



function CreateTicketPage() {
  const navigate = useNavigate();
  const token = useAuthHeader();
  const userDetails = useAuthUser();
  const [error, setError] = useState("");
  const [tenantComment, setTenantComment] = useState('');
  const [ticketType, setTicketType] = useState('');

  const handleCommentChange = (event) => {
    setTenantComment(event.target.value);
  };

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handleCreateTicket = async () => {
    console.log(tenantComment);
    console.log(token())
    //console.log("VALUES",data)
    setError("");

    try{
        const config = {
            headers: {
              Authorization: `${token()}`
            }
          };
        var currentdate = new Date(); 
        /*
        console.log('DATE',currentdate.getFullYear().toString() + '-' +
         (currentdate.getMonth()+1).toString() + '-' + 
         currentdate.getDate().toString() + ' ' + 
         currentdate.getHours().toString() + ':' + 
         ('0'+ currentdate.getMinutes()).slice(-2) + ':' + currentdate.getSeconds().toString())
         */
        //console.log(currentdate.toLocaleString())
        const values = {
          name: "--",
          email: userDetails().email,
          request_type: ticketType,
          request_description: tenantComment,
          submitted_date_time: ('DATE',currentdate.getFullYear().toString() + '-' +
          (currentdate.getMonth()+1).toString() + '-' + 
          currentdate.getDate().toString() + ' ' + 
          currentdate.getHours().toString() + ':' + 
          ('0'+ currentdate.getMinutes()).slice(-2) + ':' + currentdate.getSeconds().toString()),
          //submitted_date_time: "1000-01-01 00:00:00",
          status: "SUBMITTED",
          feedback_text: "",
          feedback_rating: "-1"
        };

        // NOTE: Backticks (`) are used here so ticketID can be evaluated
        const response1 = await axios.post(
            `http://localhost:5000/api/tenant/createTicket`,
            values,
            config
        )
        console.log("got response of creating ticket:")
        console.log(response1);

        //return response;

    } catch (err){
        if (err && err instanceof AxiosError) {
            setError(err.response);
        }
        else if (err && err instanceof Error){
            setError(err.message);
        }

        console.log("Error: ", err);
    }
  
      
    navigate('/pages/Dashboard'); // Navigate to the Dashboard form page
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      marginTop="25vh"
    >
      {/* Title */}
      <Text fontSize="2xl" marginBottom="2em">
        Create A Service Ticket
      </Text>

      {/* Comment Boxes */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        marginBottom="2em"
      >
        {/* Comment Box 1 */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="30em"
          padding="2em"
          marginRight="2em"
        >
          <Text fontSize="lg" marginBottom="1em"> 
            Location
          </Text>
          <FormControl>
            <Textarea
              rows={1}
              size="lg"
              variant="filled"
              width="100%"
              marginBottom="2em"
            />
          </FormControl>
          <Text fontSize="lg" marginBottom="1em">
            Category Of Request
          </Text>
          <FormControl>
            <Textarea
              rows={1}
              size="lg"
              variant="filled"
              width="100%"
              marginBottom="1em"
              value={ticketType}
              onChange={handleTicketTypeChange}
            />
          </FormControl>
        </Box>

        {/* Comment Box 3 */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="35em"
          padding="1em"
          marginLeft="2em"
        >
          <Text fontSize="lg" marginBottom="1em">
            Description
          </Text>
          <FormControl>
            <Textarea
              label="Your Comment"
              rows={8}
              size="lg"
              variant="filled"
              width="100%"
              value={tenantComment}
              onChange={handleCommentChange}
              marginTop="0em"
            />
          </FormControl>
        </Box>
      </Box>

      {/* Submit Ticket Button */}
      <Box marginBottom="2em">
        <Button
          size="lg"
          onClick={handleCreateTicket}
          width="15em"
          height="3em"
          backgroundColor="gray"
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="3em"
          borderRadius="0.25em"
          cursor="pointer"
          color="white"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default CreateTicketPage;