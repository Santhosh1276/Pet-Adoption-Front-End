import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const ConfirmationPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setMessage('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulating a successful update
    setMessage('Password updated successfully');
  };

  return (
    <Box 
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 20,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: 'center',
       
      }}
    >
      <Typography variant="h4" sx={{fontSize: "1rem", fontWeight: "bold"}} gutterBottom>
        Update Password
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={!!error}
          helperText={error}
        />

        {message && (
          <Typography color="success.main" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 , backgroundColor:"#2C3E50"}}
        >
          Update Password
        </Button>
      </form>
    </Box>
  );
};

export default ConfirmationPassword;
