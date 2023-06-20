import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function FeedbackForm() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = event => {
    event.preventDefault();  // prevent submission of default form
    alert(`Feedback: ${comment} Rating: ${rating}`); // popup after submission
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" minHeight="100vh">
      <form onSubmit={handleSubmit}>
        <Box mb={2} sx={{ width: '50%', margin: '0 auto' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Please leave your feedback
          </Typography>
          <TextField
            label="Comment"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={e => setComment(e.target.value)} // store user comment 
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Rating
            name="rating"
            size="large"
            value={rating}
            onChange={(event, newValue) => {setRating(newValue);}} // store user rating
          />
        </Box>
        <Box display="flex" justifyContent="center" m={1} p={1}>
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
  );
}

export default FeedbackForm;
