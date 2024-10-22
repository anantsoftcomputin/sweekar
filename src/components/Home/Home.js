import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const placeTypes = [
  { name: "Police Station", type: "police", icon: "🚓" },
  { name: "Bus Stop", type: "bus_station", icon: "🚏" },
  { name: "Private Hospital", type: "hospital", icon: "🏥" },
  { name: "Government Hospital", type: "hospital", icon: "🏥" },
  { name: "Blood Bank", type: "blood_bank", icon: "🩸" },
];

const ResourceCard = ({ resource, type, onMoreDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-lavender-300">
      <div className="text-4xl mb-2">{type.icon}</div>
      <h3 className="text-xl font-bold mb-2 text-lavender-800">{type.name}</h3>
      <p className="text-sm mb-1 text-lavender-600">{resource.name}</p>
      <p className="text-xs text-lavender-500 mb-4">{resource.vicinity}</p>
      <button 
        onClick={() => onMoreDetails(resource)}
        className="bg-lavender-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-lavender-600 transition-colors duration-300"
      >
        More Details
      </button>
    </div>
  );
};

const Home = () => {
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating resource fetching
    setTimeout(() => {
      setResources({
        "Police Station": { name: "Karelibaug Police Station", vicinity: "Near Police Parade Ground, Vadodara" },
        "Bus Stop": { name: "Central Bus Station Vadodara", vicinity: "Vadodara, India" },
        "Private Hospital": { name: "DTC Vadodara-R", vicinity: "Baroda Medical College, Vadodara" },
        "Government Hospital": { name: "SSG Hospital", vicinity: "Anandpura, Vadodara" },
        "Blood Bank": { name: "Red Cross Blood Bank", vicinity: "Race Course Circle, Vadodara" },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleMoreDetails = (resource) => {
    // Navigate to a details page for the resource
    navigate(`/resource-details/${resource.name}`, { state: { resource } });
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
            <h2 className="text-xl font-semibold text-lavender-800 mb-4 sm:mb-0">Quick Access</h2>
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

        <h2 className="text-2xl font-bold text-lavender-900 mb-6">Nearby Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeTypes.map((type) => (
            <ResourceCard 
              key={type.name} 
              resource={resources[type.name]} 
              type={type}
              onMoreDetails={handleMoreDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;