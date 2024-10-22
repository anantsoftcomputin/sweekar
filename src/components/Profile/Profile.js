import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { toast } from "react-toastify";

const Profile = () => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [likedResources, setLikedResources] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const likesRef = ref(db, "likes");
      const profileRef = ref(db, `users/${user.uid}/profile`);

      const unsubscribeLikes = onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userLikedResources = Object.entries(data)
            .filter(
              ([_, resourceData]) =>
                resourceData.users && resourceData.users.includes(user.uid)
            )
            .map(([resourceName, _]) => resourceName);
          setLikedResources(userLikedResources);
        } else {
          setLikedResources([]);
        }
        setLoading(false);
      });

      const unsubscribeProfile = onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        setProfileData(data || null);
        setLoading(false);
      });

      return () => {
        unsubscribeLikes();
        unsubscribeProfile();
      };
    }
  }, [user]);

  const handleSaveProfile = (newProfileData) => {
    const db = getDatabase();
    const profileRef = ref(db, `users/${user.uid}/profile`);
    set(profileRef, newProfileData)
      .then(() => {
        setProfileData(newProfileData);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error saving profile data:", error);
        toast.error("Error While saving profile data");
      });
  };

  const ProfileListItem = ({ icon, primary, secondary }) => (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-soft">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full border-2 border-lavender-600 bg-lavender-50 flex items-center justify-center text-lavender-700">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lavender-900">{primary}</p>
        <p className="text-sm text-lavender-600 truncate">{secondary}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-lavender-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="bg-gradient-to-r from-accent-blue to-lavender-600 p-8 text-white">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt={user.displayName || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="mt-4 text-2xl font-bold">
                {user.displayName || "Anonymous User"}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-white/70 hover:bg-white/90 rounded-lg transition-colors duration-200 text-lavender-700"
              >
                Update Profile
              </button>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProfileListItem
                  icon={<UserIcon />}
                  primary="Name"
                  secondary={user.displayName}
                />
                <ProfileListItem
                  icon={<MailIcon />}
                  primary="Email"
                  secondary={user.email}
                />
                {profileData && (
                  <>
                    <ProfileListItem
                      icon={<PhoneIcon />}
                      primary="Phone Number"
                      secondary={profileData.phoneNumber}
                    />
                    <ProfileListItem
                      icon={<CrossIcon />}
                      primary="Blood Group"
                      secondary={profileData.bloodGroup}
                    />
                    <ProfileListItem
                      icon={<BuildingIcon />}
                      primary="City"
                      secondary={profileData.city}
                    />
                    <ProfileListItem
                      icon={<UserGroupIcon />}
                      primary="Gender"
                      secondary={profileData.gender}
                    />
                    <ProfileListItem
                      icon={<CalendarIcon />}
                      primary="Date of Birth"
                      secondary={profileData.dateOfBirth}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-lavender-900 mb-4">
              Liked Resources
            </h3>
            <div className="border-t border-lavender-200"></div>

            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600"></div>
              </div>
            ) : likedResources.length > 0 ? (
              <div className="space-y-4 mt-4">
                {likedResources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-lavender-50 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent-pink flex items-center justify-center text-white">
                      <HeartIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-lavender-900">
                        {resource}
                      </p>
                      <p className="text-sm text-lavender-600">
                        Liked Resource ({index + 1})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-lavender-50 rounded-lg p-4 mt-4 text-center text-lavender-600">
                You Haven't Liked Any Resources Yet.
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProfileForm
              initialData={profileData}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileForm = ({ initialData, onSave, onCancel, user }) => {
  const [formData, setFormData] = useState({
    name: user.displayName || initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: user.email || initialData?.email || "",
    bloodGroup: initialData?.bloodGroup || "",
    city: initialData?.city || "",
    gender: initialData?.gender || "",
    dateOfBirth: initialData?.dateOfBirth || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-lavender-900">Edit Profile</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-lavender-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-lavender-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-lavender-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="bloodGroup"
            className="block text-sm font-medium text-lavender-700"
          >
            Blood Group
          </label>
          <input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-lavender-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-lavender-700"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-lavender-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-lavender-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-lavender-700 hover:text-lavender-800 bg-white border border-lavender-300 rounded-lg hover:bg-lavender-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-lavender-600 rounded-lg hover:bg-lavender-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Icon components (you'll need to implement these or use a library like heroicons)
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
      clipRule="evenodd"
    />
  </svg>
);
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z"
      clipRule="evenodd"
    />
  </svg>
);
const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
      clipRule="evenodd"
    />
  </svg>
);
const UserGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path d="m15 1.784-.796.795a1.125 1.125 0 1 0 1.591 0L15 1.784ZM12 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L12 1.784ZM9 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L9 1.784ZM9.75 7.547c.498-.021.998-.035 1.5-.042V6.75a.75.75 0 0 1 1.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 0 1 1.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 0 0-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 0 1 1.5 0v.797ZM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 0 1 2.585.364 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 2.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0 0 12 12.75ZM21.75 18.131a2.604 2.604 0 0 0-1.915.165 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.604 2.604 0 0 0-1.915-.165v2.494c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494Z" />
  </svg>
);
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
);
export default Profile;
