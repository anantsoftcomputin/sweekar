import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
} from "firebase/database";
import { auth } from "../../../firebase";

const ResourceCard = ({ resource }) => {
  const user = auth.currentUser;
  const [userLocation, setUserLocation] = useState(null);
  const [likes, setLikes] = useState({});
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentResource, setCurrentResource] = useState(null);
  const [showHours, setShowHours] = useState(null);
  const [openHours, setOpenHours] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);

  useEffect(() => {
    if (user) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const likesRef = ref(db, "likes");

    const unsubscribe = onValue(likesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikes(data);
      } else {
        setLikes({});
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLike = (resourceName) => {
    if (!user) {
      toast.info("Please Log In To Like This Resource.");
      return;
    }

    const db = getDatabase();
    const likeRef = ref(db, `likes/${resourceName}`);

    const currentLikes = likes[resourceName] || { count: 0, users: [] };
    const userLiked = currentLikes.users.includes(user.uid);

    if (userLiked) {
      // Unlike
      const updatedUsers = currentLikes.users.filter((uid) => uid !== user.uid);
      const newCount = updatedUsers.length;

      set(likeRef, {
        count: newCount,
        users: updatedUsers,
      })
        .then(() => {
          setLikes((prev) => ({
            ...prev,
            [resourceName]: { count: newCount, users: updatedUsers },
          }));
          toast.success("You Unliked This Resource!");
        })
        .catch((error) => {
          toast.error("Error Unliking Resource: " + error.message);
        });
    } else {
      // Like
      const updatedUsers = [...currentLikes.users, user.uid];
      const newCount = updatedUsers.length;

      set(likeRef, {
        count: newCount,
        users: updatedUsers,
      })
        .then(() => {
          setLikes((prev) => ({
            ...prev,
            [resourceName]: { count: newCount, users: updatedUsers },
          }));
          toast.success("You Liked This Resource!");
        })
        .catch((error) => {
          toast.error("Error Liking Resource: " + error.message);
        });
    }
  };

  const handleClickOpen = (resource) => {
    setCurrentResource(resource);
    setOpen(true);

    // Fetch comments for the selected resource from Firebase
    const db = getDatabase();
    const commentsRef = ref(db, `comments/${resource.name}`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedComments = data
        ? Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
        : [];
      setComments(fetchedComments);
    });
  };

  const handleClose = () => {
    setOpen(false);
    setComment("");
    setEditComment(false);
    setCurrentCommentId(null);
  };

  const handleSubmit = () => {
    const db = getDatabase();

    if (user) {
      if (editComment && currentCommentId) {
        const commentRef = ref(
          db,
          `comments/${currentResource.name}/${currentCommentId}`
        );
        set(commentRef, {
          userName: user.displayName || "Anonymous",
          comment,
          time: new Date().toLocaleString(),
        })
          .then(() => {
            toast.success("Comment Updated Successfully!");
            handleClose();
          })
          .catch((error) => {
            toast.error("Failed To Update Comment: " + error.message);
          });
      } else {
        const commentsRef = ref(db, `comments/${currentResource.name}`);
        const newCommentRef = push(commentsRef);

        set(newCommentRef, {
          userName: user.displayName || "Anonymous",
          comment,
          time: new Date().toLocaleString(),
        })
          .then(() => {
            toast.success("Comment Added Successfully!");
            handleClose();
          })
          .catch((error) => {
            toast.error("Failed To Add Comment: " + error.message);
          });
      }
    } else {
      toast.info("Please LogIn To Submit A Comment.");
    }
  };

  const handleDelete = (commentId) => {
    const db = getDatabase();
    const commentRef = ref(db, `comments/${currentResource.name}/${commentId}`);
    remove(commentRef)
      .then(() => {
        toast.success("Comment Deleted Successfully!");
      })
      .catch((error) => {
        toast.error("Error Deleting Comment: " + error.message);
      });
  };

  const handleEdit = (item) => {
    setComment(item.comment);
    setCurrentCommentId(item.id);
    setEditComment(true);
  };

  const handleDirections = (resource) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${resource?.lat},${resource?.lng}`;
    window.open(url, "_blank");
  };

  const handleShareResource = (resource) => {
    const message = `Name: ${resource?.name}\nAddress: ${resource?.address}\nPhone: ${resource?.phone}\nLocation: https://www.google.com/maps?q=${resource?.lat},${resource?.lng}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShowHours = (resource) => {
    setShowHours(resource);
    setOpenHours(true);
  };

  const handleCloseHours = () => {
    setOpenHours(false);
    setShowHours(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {resource?.map((resource, index) => {
        const resourceLikes = likes?.[resource?.name] || {
          count: 0,
          users: [],
        };
        const isLiked = user
          ? resourceLikes?.users?.includes(user?.uid)
          : false;
        return (
          <div
            key={index}
            className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl h-full"
          >
            <div className="relative">
              <img
                src={
                  resource.photoUrl ||
                  "https://via.placeholder.com/400x300.png?text=No+Image+Available"
                }
                alt={resource?.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 left-0 bg-lavender-950 text-white px-2 py-1 text-sm rounded-br">
                {resource?.status}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-lavender-950 mb-2">
                {resource?.name}
              </h2>
              <p className="text-sm text-lavender-800 mb-4">
                {resource?.address}
              </p>
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-lavender-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-lavender-800">{resource?.phone}</span>
              </div>
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-lavender-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-lavender-800">{resource?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleLike(resource?.name)}
                  className={`flex items-center ${
                    isLiked ? "text-red-500" : "text-lavender-600"
                  } hover:text-red-500 transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-1"
                    fill={isLiked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {resourceLikes.count}{" "}
                  {resourceLikes.count === 1 ? "like" : "likes"}
                </button>
                <button
                  onClick={() => handleClickOpen(resource)}
                  className="text-lavender-600 hover:text-lavender-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleShowHours(resource)}
                  className="text-lavender-600 hover:text-lavender-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleShareResource(resource)}
                  className="text-lavender-600 hover:text-lavender-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDirections(resource)}
                  className="text-lavender-600 hover:text-lavender-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Comments Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-lavender-950 mb-4">
                {editComment ? "Edit Comment" : "Add a Comment"}
              </h2>

              <div className="mt-4 space-y-4">
                {comments.map((item, index) => (
                  <div key={index} className="bg-lavender-50 p-3 rounded-md">
                    <p className="font-semibold text-lavender-950">
                      {item.userName}
                    </p>
                    <p className="text-lavender-800 mt-1">{item.comment}</p>
                    {user && user.displayName === item.userName && (
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-lavender-600 hover:text-lavender-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <textarea
                rows="4"
                className="mt-4 w-full p-2 border border-lavender-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={editComment ? "Edit Your Comment" : "Your Comment"}
              />
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lavender-600 text-base font-medium text-white hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
              >
                {editComment ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operating Hours Dialog */}
      {openHours && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-lavender-950 mb-4">
                {showHours?.name} Operating Hours
              </h2>
              {showHours?.time?.split(", ").map((item, index) => (
                <p key={index} className="text-lavender-800">
                  {item?.trim()}
                </p>
              ))}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lavender-600 text-base font-medium text-white hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleCloseHours}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
