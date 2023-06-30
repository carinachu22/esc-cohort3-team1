import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


function CloseTicketPage() {
  const navigate = useNavigate();
  const [tenantComment, setTenantComment] = useState("");

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

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" minHeight="100vh">
      <Box sx={{ width: '75%', margin: '0 auto', mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          ticket name
        </Typography>
        <Typography variant="h5" gutterBottom>
          Ticket Description
        </Typography>
        <Typography variant="h5" gutterBottom>
          Owner's Comments
        </Typography>
        <TextField
          label="Your Comment"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={tenantComment}
          onChange={handleCommentChange}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="success" onClick={handleCloseTicket} sx={{ mr: 2 }}>
          Close Ticket
        </Button>
        <Button variant="contained" color="error" onClick={handleRejectTicket}>
          Reject Closing
        </Button>
      </Box>
    </Box>
  );
}

export default CloseTicketPage;