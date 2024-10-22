import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";

const ResourceDetail = () => {
  const { resourceId } = useParams(); // Get the resource ID from the URL
  const [resource, setResource] = useState(null);

  const fetchResourceDetails = useCallback(() => {
    if (!resourceId) {
      console.log("No resource ID found.");
      return;
    }

    // Construct the Firebase path to fetch resource details
    const resourceRef = ref(database, `resources/${resourceId}`);
    onValue(resourceRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Resource data found:", snapshot.val());
        setResource(snapshot.val());
      } else {
        console.log("No resource found with this ID in the database.");
        setResource(null);
      }
    });
  }, [resourceId]);

  useEffect(() => {
    console.log("Resource ID:", resourceId); // Debug log to confirm resource ID is being received
    fetchResourceDetails();
  }, [fetchResourceDetails, resourceId]);

  if (!resource) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Resource Details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "16px" }}>
      {/* Display the resource details */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        {resource.name}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {resource.description || "No description available."}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Address: {resource.address || "N/A"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Phone: {resource.phone || "N/A"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Email: {resource.email || "N/A"}
      </Typography>

      {/* Display the Google Map with this resource pin */}
      <Box sx={{ mt: 2, height: 300 }}>
        <Googlemap
          resources={[resource]}
          category={resource.category}
          center={{ lat: resource.lat, lng: resource.lng }}
        />
      </Box>
    </Box>
  );
};

export default ResourceDetail;
