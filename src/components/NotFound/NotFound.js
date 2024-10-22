import { Box, Typography } from '@mui/material';

function NotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h6">Page Not Found</Typography>
    </Box>
  );
}

export default NotFound;