import React from "react";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";

const mentalHealthResources = [
  "RAHI - Recovering and Healing from Incest. Phone: (011) 26238466 / 26224042 / 26227647",
  "JAGORI - Mental wellness hotline: (011) 26692700 / +91 8800996640",
  "SAARTHAK - Mental health support: (011) 26853846 / 26524061",
];

const MentalHealth = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Mental Health Resources
      </Typography>
      <List>
        {mentalHealthResources.map((resource, index) => (
          <ListItem key={index}>
            <ListItemText primary={resource} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MentalHealth;
