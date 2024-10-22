import React from 'react';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';

const healthcareResources = [
  'National Commission for Women Helpline: 7827170170',
  'Police Helpline: 1091 / 1291',
  'Central Social Welfare Board - Police Helpline: (011) 23317004',
  'Shakti Shalini - Women\'s Shelter: (011) 249782307 / 24373737',
];

const HealthCare = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Healthcare Resources
      </Typography>
      <List>
        {healthcareResources.map((resource, index) => (
          <ListItem key={index}>
            <ListItemText primary={resource} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default HealthCare;
