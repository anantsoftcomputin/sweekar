import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const placeTypes = [
  { name: "Police Station", type: "police", icon: "🚓" },
  { name: "Bus Stop", type: "bus_station", icon: "🚏" },
  { name: "Private Hospital", type: "hospital", icon: "🏥" },
  { name: "Government Hospital", type: "hospital", icon: "🏥" },
  { name: "Blood Bank", type: "blood_bank", icon: "🩸" },
];

const ResourceCard = ({ resource, type, icon, onMoreDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-lavender-300">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-lavender-800">{type}</h3>
      <p className="text-sm mb-1 text-lavender-600">
        {resource?.name || "N/A"}
      </p>
      <p className="text-xs text-lavender-500 mb-4">
        {resource?.vicinity || "N/A"}
      </p>
      <button
        onClick={() => onMoreDetails(resource)}
        className="bg-lavender-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-lavender-600 transition-colors duration-300"
      >
        View Direction
      </button>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (navigator.geolocation && isLoaded) {
      const locationTimeout = setTimeout(() => {
        setUserLocation(defaultCenter);
        fetchResources(defaultCenter);
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          fetchResources(userPos);
        },
        (error) => {
          console.error("Error getting user location:", error);
          clearTimeout(locationTimeout);
          setUserLocation(defaultCenter);
          fetchResources(defaultCenter);
        }
      );
    } else if (isLoaded) {
      setUserLocation(defaultCenter);
      fetchResources(defaultCenter);
    }
  }, [isLoaded]);

  const fetchResources = (location) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps library is not loaded!");
      setLoading(false);
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const resourceRequests = placeTypes.map((place) => {
      return new Promise((resolve) => {
        const request = {
          location,
          radius: "10000",
          type: place.type,
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({ [place.name]: results?.length > 0 ? results[0] : null });
          } else {
            resolve({ [place.name]: null });
          }
        });
      });
    });

    Promise.all(resourceRequests)
      .then((results) => {
        const fetchedResources = results.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
        setResources(fetchedResources);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
        setLoading(false);
      });
  };

  const handleDirections = (resource) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${
      userLocation.lat
    },${
      userLocation.lng
    }&destination=${resource.geometry.location.lat()},${resource.geometry.location.lng()}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lavender-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-lavender-800 mb-4 sm:mb-0">
              Quick Access
            </h2>
            <div className="space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate("/women-resources")}
                className="w-full sm:w-auto bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors duration-300"
              >
                Women Resources
              </button>
              <button
                onClick={() => navigate("/lgbtqia-resources")}
                className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300"
              >
                LGBTQIA+ Resources
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-lavender-900 mb-6">
          Nearby Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(resources).map(([resourceType, resource], index) => {
            const place = placeTypes.find((p) => p.name === resourceType);
            return (
              <ResourceCard
                key={index}
                resource={resource}
                type={resourceType}
                icon={place?.icon}
                onMoreDetails={handleDirections}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
