import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  
  Avatar,
  Divider,
  IconButton,
  Card,
  CardContent,
  Button,
  Grid,
  CardHeader,
  CardActions,
  
} from "@mui/material";
import { auth, db } from "../../firebase"; // Import Firebase Firestore
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ResourceCard from "../Resources/ResourceCard/ResourceCard"; 

const Profile = () => {
  const [likedResources, setLikedResources] = useState([]);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  // Fetch liked resources from Firestore
  const fetchLikedResources = async () => {
    if (!user) return;

    try {
      // Get all resources where the user has liked
      const resourcesCollection = collection(db, "resources");
      const q = query(resourcesCollection);
      const querySnapshot = await getDocs(q);
      const likedResourcesArray = [];

      for (const resourceDoc of querySnapshot.docs) {
        const likesCollection = collection(
          db,
          "resources",
          resourceDoc.id,
          "likes"
        );
        const likeDocRef = doc(likesCollection, user.uid);
        const likeDoc = await getDoc(likeDocRef);
        if (likeDoc.exists()) {
          const resourceData = resourceDoc.data();
          likedResourcesArray.push({
            id: resourceDoc.id,
            ...resourceData,
          });
        }
      }

      setLikedResources(likedResourcesArray);
    } catch (error) {
      console.error("Error fetching liked resources:", error);
    }
  };

  // Fetch comments from Firestore
  const fetchUserComments = async () => {
    if (!user) return;

    try {
      const commentsArray = [];
      // Listen to all comments in resources where the user has commented
      const resourcesCollection = collection(db, "resources");
      const q = query(resourcesCollection);
      const querySnapshot = await getDocs(q);

      for (const resourceDoc of querySnapshot.docs) {
        const commentsCollection = collection(
          db,
          "resources",
          resourceDoc.id,
          "comments"
        );
        const userCommentsQuery = query(
          commentsCollection,
          where("userId", "==", user.uid)
        );
        const commentsSnapshot = await getDocs(userCommentsQuery);
        commentsSnapshot.forEach((commentDoc) => {
          commentsArray.push({
            id: commentDoc.id,
            resourceId: resourceDoc.id,
            resourceName: resourceDoc.data().name,
            ...commentDoc.data(),
          });
        });
      }

      setComments(commentsArray);
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLikedResources();
      fetchUserComments();
    }
  }, [user]);

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ ml: 2 }}>
          My Profile
        </Typography>
      </Box>

      {/* User Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Avatar
          alt={user.displayName || user.email}
          src={user.photoURL}
          sx={{ width: 80, height: 80, mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}
        />
        <Box>
          <Typography variant="h6">
            {user.displayName || "Anonymous User"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Liked Resources Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Liked Resources
      </Typography>
      {likedResources.length > 0 ? (
        <Grid container spacing={2}>
          {likedResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2">
          You have not liked any resources yet.
        </Typography>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Comments Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Comments
      </Typography>
      {comments.length > 0 ? (
        <List>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Card variant="outlined">
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#8e24aa" }}>
                      {comment.resourceName.charAt(0)}
                    </Avatar>
                  }
                  title={comment.resourceName}
                  subheader={new Date(
                    comment.createdAt?.toDate()
                  ).toLocaleString()}
                />
                <CardContent>
                  <Typography variant="body2">{comment.text}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/resources/${comment.resourceId}`, {
                        state: { resourceId: comment.resourceId },
                      })
                    }
                  >
                    View Resource
                  </Button>
                  {/* Optionally, add edit/delete functionality for comments */}
                </CardActions>
              </Card>
            </Box>
          ))}
        </List>
      ) : (
        <Typography variant="body2">
          You have not commented on any resources yet.
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
