import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";

const ResourceCard = ({ resource, onResourceUpdated }) => {
  const [likes, setLikes] = useState(resource.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showHours, setShowHours] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [directionsVisible, setDirectionsVisible] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const commentsSnapshot = await getDocs(
        collection(db, `resources/${resource.id}/comments`)
      );
      const commentsList = commentsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setComments(commentsList);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [resource.id]);

  useEffect(() => {
    fetchComments();
    setLiked(false); // Assuming you have logic to determine if the user liked it
  }, [fetchComments]);

  const handleLike = async () => {
    try {
      const resourceRef = doc(db, "resources", resource.id);
      const newLikes = liked ? likes - 1 : likes + 1;
      await updateDoc(resourceRef, { likes: newLikes });
      setLikes(newLikes);
      setLiked(!liked);
      if (onResourceUpdated) onResourceUpdated(resource.id, newLikes);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: resource.name,
      text: `Check out this resource: ${resource.name} located at ${resource.address}.`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Resource shared successfully."))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(`Resource: ${resource.name} copied to clipboard!`);
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
    try {
      if (editComment) {
        await updateDoc(
          doc(db, `resources/${resource.id}/comments`, editComment.id),
          { text: newComment }
        );
        setEditComment(null);
      } else {
        await addDoc(collection(db, `resources/${resource.id}/comments`), {
          text: newComment,
          user: auth.currentUser?.displayName || "Anonymous",
          createdAt: new Date().toISOString(),
        });
      }
      setNewComment("");
      fetchComments();
      setCommentDialogOpen(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditComment(comment);
    setNewComment(comment.text);
    setCommentDialogOpen(true);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, `resources/${resource.id}/comments`, commentId));
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl max-w-sm mx-auto">
      <div className="relative">
        <img 
          src={resource.photoUrl || "https://via.placeholder.com/400x300.png?text=No+Image+Available"} 
          alt={resource.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 bg-lavender-950 text-white px-2 py-1 text-sm rounded-br">
          {resource.status}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-lavender-950 mb-2">{resource.name}</h2>
        <p className="text-sm text-lavender-800 mb-4">{resource.address}</p>
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span className="text-lavender-800">{resource.phone}</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="text-lavender-800">{resource.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={handleLike} className={`flex items-center ${liked ? 'text-red-500' : 'text-lavender-600'} hover:text-red-500 transition-colors`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likes}</span>
          </button>
          <button onClick={() => setCommentDialogOpen(true)} className="text-lavender-600 hover:text-lavender-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <button onClick={() => setShowHours(true)} className="text-lavender-600 hover:text-lavender-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button onClick={handleShare} className="text-lavender-600 hover:text-lavender-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full bg-lavender-200 hover:bg-lavender-300 text-lavender-800 font-semibold py-2 px-4 rounded transition-colors"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-4">
          <h3 className="font-semibold text-lavender-950 mb-2">Operating Hours:</h3>
          {resource.time ? (
            resource.time.split(", ").map((time, index) => (
              <p key={index} className="text-sm text-lavender-800">{time}</p>
            ))
          ) : (
            <p className="text-sm text-lavender-800">No operating hours available.</p>
          )}
        </div>
      )}
      {directionsVisible && (
        <div className="mt-4">
          <Googlemap
            center={{ lat: resource.lat, lng: resource.lng }}
            destination={{ lat: resource.lat, lng: resource.lng }}
            directions={true}
          />
        </div>
      )}

      {/* Comments Dialog */}
      {commentDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-lavender-950 mb-4">{editComment ? "Edit Comment" : "Add a Comment"}</h2>
              <textarea
                className="w-full p-2 border border-lavender-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender-500"
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Your comment..."
              ></textarea>
              <div className="mt-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-lavender-50 p-3 rounded-md">
                    <p className="font-semibold text-lavender-950">{comment.user}</p>
                    <p className="text-lavender-800 mt-1">{comment.text}</p>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button onClick={() => handleEditComment(comment)} className="text-lavender-600 hover:text-lavender-800">Edit</button>
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lavender-600 text-base font-medium text-white hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleCommentSubmit}
              >
                {editComment ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setCommentDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operating Hours Dialog */}
      {showHours && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-lavender-950 mb-4">Operating Hours</h2>
              {resource.time ? (
                resource.time.split(", ").map((time, index) => (
                  <p key={index} className="text-lavender-800">{time}</p>
                ))
              ) : (
                <p className="text-lavender-800">No operating hours available.</p>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-lavender-600 text-base font-medium text-white hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowHours(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directions Button */}
      <div className="px-4 pb-4">
        <button 
          onClick={() => setDirectionsVisible(!directionsVisible)}
          className="w-full bg-lavender-600 hover:bg-lavender-700 text-white font-semibold py-2 px-4 rounded transition-colors mt-2"
        >
          {directionsVisible ? "Hide Directions" : "Show Directions"}
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;