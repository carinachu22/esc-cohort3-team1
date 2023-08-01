import React, { useState, useEffect } from 'react';
import { Box, Heading, Textarea, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';

function CloseTicketPage() {
  const navigate = useNavigate();
  const [tenantComment, setTenantComment] = useState("");
  const authenticated = useIsAuthenticated();

  const handleCommentChange = (event) => {
    setTenantComment(event.target.value);
  };

  const handleCloseTicket = () => {
    console.log(tenantComment);
    navigate('/FeedbackForm');     // Navigate to the feedback form page
  };

  const handleRejectTicket = () => {
    console.log('Ticket closing rejected');
  };
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
    <Box display="flex" flexDirection="column" justifyContent="center" minHeight="100vh" alignItems="center">
      <Box w="75%" mt={4}>
        <Heading as="h1" size="xl" mb={4}>ticket name</Heading>
        <Heading as="h2" size="lg" mb={2}>Ticket Description</Heading>
        <Heading as="h2" size="lg" mb={2}>Owner`&apos;`s Comments</Heading>
        <Textarea
          placeholder="Your Comment"
          size="sm"
          mb={4}
          value={tenantComment}
          onChange={handleCommentChange}
        />
        <Button colorScheme="green" onClick={handleCloseTicket} mr={2}>
          Close Ticket
        </Button>
        <Button colorScheme="red" onClick={handleRejectTicket}>
          Reject Closing
        </Button>
      </Box>
    </Box>
  );
}

export default CloseTicketPage;
