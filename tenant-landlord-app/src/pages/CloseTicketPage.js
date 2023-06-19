import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function CloseTicketPage() {
  const navigate = useNavigate();
  const [tenantComment, setTenantComment] = useState('');

  const handleCommentChange = (event) => {
    setTenantComment(event.target.value);
  };

  const handleCloseTicket = () => {
    console.log(tenantComment);
    navigate('/FeedbackForm'); // Navigate to the feedback form page
  };

  const handleRejectTicket = () => {
    console.log('Ticket closing rejected');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      style={{
        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
        marginTop: '25vh', // Adjust the marginTop value as per your preference
      }}
    >
      {/* Title */}
      <Typography variant="h4" gutterBottom style={{ marginBottom: '2em' }}>
        Create A Service Ticket
      </Typography>

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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '30em',
            padding: '2em',
            marginRight: '2em',
          }}
        >
          <Typography variant="h5" gutterBottom> 
            Location
          </Typography>
          <TextField
            multiline
            rows={1}
            variant="outlined"
            fullWidth
            InputProps={{ style: { width: '100%' } }}
            style={{
              border: '2px solid gray',
              backgroundColor: 'rgb(229, 226, 226)',
              borderRadius: '0.25em',
              paddingLeft: '0.5em',
              marginBottom: '2em',             
            }}
          />
          <Typography variant="h5" gutterBottom>
            Category Of Request
          </Typography>
          <TextField
            multiline
            rows={1}
            variant="outlined"
            fullWidth
            InputProps={{ style: { width: '100%' } }}
            style={{
              border: '2px solid gray',
              backgroundColor: 'rgb(229, 226, 226)',
              borderRadius: '0.25em',
              paddingLeft: '0.5em',
              marginBottom: '1em',
            }}
          />
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
          <Typography variant="h5" gutterBottom>
            Description
          </Typography>
          <TextField
            label="Your Comment"
            multiline
            rows={8}
            variant="outlined"
            fullWidth
            value={tenantComment}
            onChange={handleCommentChange}
            style={{
              border: '2px solid gray',
              backgroundColor: 'rgb(229, 226, 226)',
              borderRadius: '0.25em',
              paddingLeft: '0.5em',
              marginTop: '0em',
            }}
          />
        </Box>
      </Box>

      {/* Submit Ticket Button */}
      <Box marginBottom="2em">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCloseTicket}
          style={{
            width: '15em',
            height: '2.5em',
            backgroundColor: 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: '0.5s',
            marginTop: '3em',
            borderRadius: '0.25em',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default CloseTicketPage;