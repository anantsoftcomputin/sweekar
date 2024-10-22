import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

// Define advanced keywords for each category based on detailed requirements
const categoryKeywords = {
  healthcare: [
    "women's health services",
    "gynecology clinics",
    "obstetrics care",
    "reproductive health",
    "breast health screening",
    "prenatal care",
    "family planning services",

  ],
  
  mentalhealth: [
    "mental health resources",
    "mental wellness",
    "emotional well-being",
    "psychological support",
    "behavioral health services",
    "depression support",
    "therapy services",
    "counseling centers",
    "group therapy",
    "self-help programs",
  ],
  legal: [
    "legal aid for women",
    "family law assistance",
    "domestic violence legal help",
    "women rights advocacy",
    "child custody legal aid",
    "sexual harassment legal resources",
    "legal counseling for women",
  ],
  safety: [
    "domestic violence shelters",
    "police stations",
    "she teams",
    "women crisis centers",
    "safety planning for women",
    "self-defense classes",
    "stalking support services",
    "intimate partner violence resources",
  ],
  childcare: [
    "affordable daycare",
    "single mother childcare assistance",
    "early childhood education",
    "after-school programs",
    "nanny services",
    "childcare providers",
  ],
  education: [
    "women education programs",
    "scholarships for women",
    "STEM programs for girls",
    "adult education for women",
    "women vocational training",
    "career training for women",
  ],
  career: [
    "job search assistance for women",
    "career counseling for women",
    "networking events for women",
    "career advancement",
    "entrepreneurship for women",
  ],
  financial: [
    "financial planning for women",
    "women investment groups",
    "retirement planning for women",
    "grants for women",
    "microloans for women entrepreneurs",
  ],
  leadership: [
    "female leadership development",
    "women in leadership conferences",
    "mentorship programs for women",
    "leadership coaching for women",
    "public speaking for women",
  ],
  wellness: [
    "fitness classes for women",
    "nutrition advice for women",
    "yoga classes for women",
    "women health retreats",
    "mindfulness for women",
    "stress reduction techniques",
  ],
  supportgroups: [
    "support groups for women",
    "community support",
    "group therapy for women",
  ],


  // LGBTQIA+ categories
   // LGBTQIA+ categories (prefixed with 'lgbtq_')
   lgbtq_healthcare: [
    "LGBTQIA+ friendly clinics",
    "LGBTQ health centers",
    "transgender health services",
  ],
  lgbtq_mentalhealth: [
    "LGBTQIA+ counseling",
    "LGBTQ therapy services",
    "queer mental health support",
  ],
  lgbtq_legalaid: [
    "LGBTQIA+ legal aid",
    "LGBTQ rights organizations",
    "gender identity legal services",
  ],
  lgbtq_supportgroups: [
    "LGBTQIA+ support groups",
    "queer community centers",
    "LGBTQ peer support",
  ],
  lgbtq_education: [
    "LGBTQIA+ education programs",
    "queer studies programs",
    "LGBTQ scholarships",
  ],
  lgbtq_career: [
    "LGBTQIA+ job support",
    "queer professional networks",
    "LGBTQ friendly employers",
  ],
  lgbtq_safety: [
    "LGBTQIA+ safe spaces",
    "anti-violence projects",
    "hate crime support services",
  ],
  lgbtq_leadership: [
    "LGBTQIA+ leadership programs",
    "queer leadership conferences",
  ],
  lgbtq_wellness: [
    "LGBTQIA+ wellness programs",
    "queer fitness groups",
    "LGBTQ yoga classes",
  ],





  
};

const categoryTypes = {
  healthcare: ["hospital", "health", "doctor", "clinic"],
  mentalhealth: ["health", "doctor", "hospital", "physiotherapist"],
  legal: ["lawyer", "local_government_office"],
  safety: ["police", "fire_station"],
  childcare: ["school", "day_care", "establishment"],
  education: ["school", "university"],
  career: ["university", "establishment"],
  financial: ["bank", "finance"],
  leadership: ["establishment"],
  wellness: ["gym", "spa", "health"],
  "support-groups": ["establishment"],

  // LGBTQIA+ types
  lgbtq_healthcare: ["hospital", "health", "doctor", "clinic"],
  lgbtq_mentalhealth: ["health", "doctor", "hospital", "physiotherapist"],
  lgbtq_legalaid: ["lawyer", "local_government_office"],
  lgbtq_supportgroups: ["establishment"],
  lgbtq_education: ["school", "university"],
  lgbtq_career: ["establishment"],
  lgbtq_safety: ["police", "establishment"],
  lgbtq_leadership: ["establishment"],
  lgbtq_wellness: ["gym", "spa", "health"],
};

const Googlemap = ({ onResourcesFetched = () => {}, center }) => {
  const { category } = useParams(); // Extract category from route params
  const [userLocation, setUserLocation] = useState(null);
  const [lastFetchedLocation, setLastFetchedLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [nearbyResources, setNearbyResources] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const locationWatcher = useRef(null);

  const fetchNearbyPlaces = useCallback(
    (location, keywords) => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps library is not loaded!");
        return;
      }

      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      const promises = keywords.map((keyword) => {
        return new Promise((resolve) => {
          const request = {
            location,
            radius: 10000, // 10 km radius
            keyword: keyword,
          };

          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(results);
            } else {
              console.error(
                "PlacesService request failed with status:",
                status
              );
              resolve([]); // Return empty array on error
            }
          });
        });
      });

      Promise.all(promises).then((resultsArray) => {
        // Flatten the results
        const allResults = [].concat(...resultsArray);

        // Deduplicate the results by place_id
        const uniqueResults = [];
        const placeIds = new Set();

        allResults.forEach((place) => {
          if (!placeIds.has(place.place_id)) {
            placeIds.add(place.place_id);
            uniqueResults.push(place);
          }
        });

        // Now get details for each unique result
        const detailPromises = uniqueResults.map((place) => {
          return new Promise((resolve) => {
            const detailsRequest = {
              placeId: place.place_id,
              fields: [
                "name",
                "vicinity",
                "geometry",
                "formatted_phone_number",
                "business_status",
                "opening_hours",
                "photos",
                "types",
              ],
            };

            service.getDetails(
              detailsRequest,
              (placeDetails, detailsStatus) => {
                if (
                  detailsStatus ===
                  window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  const photoUrl =
                    placeDetails.photos &&
                    placeDetails.photos.length > 0 &&
                    `${placeDetails.photos[0].getUrl({
                      maxHeight: 300,
                      maxWidth: 400,
                    })}`;

                  const formattedResource = {
                    name: placeDetails.name,
                    address: placeDetails.vicinity,
                    lat: placeDetails.geometry.location.lat(),
                    lng: placeDetails.geometry.location.lng(),
                    phone: placeDetails.formatted_phone_number || "N/A",
                    email: placeDetails.email || "N/A",
                    status: placeDetails.opening_hours?.isOpen()
                      ? "Open"
                      : "Closed",
                    time:
                      placeDetails.opening_hours?.weekday_text?.join(", ") ||
                      "N/A",
                    photoUrl,
                    types: placeDetails.types || [],
                  };

                  resolve(formattedResource);
                } else {
                  console.error(
                    "getDetails failed for placeId",
                    place.place_id,
                    "with status:",
                    detailsStatus
                  );
                  resolve(null); // Resolve null on error
                }
              }
            );
          });
        });

        Promise.all(detailPromises).then((detailedResources) => {
          // Filter out any null values
          const validResources = detailedResources.filter(
            (res) => res !== null
          );

          // Filter based on acceptable types
          const acceptableTypes = categoryTypes[category?.toLowerCase()] || [];

          const filteredResources = validResources.filter((resource) => {
            if (acceptableTypes.length === 0) {
              return true; // If no acceptable types are defined, include all
            }
            return resource.types.some((type) =>
              acceptableTypes.includes(type)
            );
          });

          // Optional: Filter resources within 10 km radius
          const resourcesWithinRadius = filteredResources.filter((resource) => {
            const distance = getDistance(
              location.lat,
              location.lng,
              resource.lat,
              resource.lng
            );
            return distance <= 10000; // 10 km in meters
          });

          onResourcesFetched(resourcesWithinRadius);
          setNearbyResources(resourcesWithinRadius);
        });
      });
    },
    [onResourcesFetched, category]
  );

  // Function to calculate distance between two coordinates
  const getDistance = (lat1, lon1, lat2, lon2) => {
    function toRad(Value) {
      return (Value * Math.PI) / 180;
    }
    const R = 6371e3; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // in meters
  };

  useEffect(() => {
    const keywords = categoryKeywords[category?.toLowerCase()] || [
      "women health services",
    ];
    if (isLoaded && window.google) {
      if (navigator.geolocation) {
        // Start watching the user's position
        locationWatcher.current = navigator.geolocation.watchPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(userPos);

            if (lastFetchedLocation) {
              const distance = getDistance(
                lastFetchedLocation.lat,
                lastFetchedLocation.lng,
                userPos.lat,
                userPos.lng
              );
              if (distance >= 100) {
                // User moved more than 100 meters
                setLastFetchedLocation(userPos);
                fetchNearbyPlaces(userPos, keywords);
              }
            } else {
              setLastFetchedLocation(userPos);
              fetchNearbyPlaces(userPos, keywords);
            }
          },
          (error) => {
            console.error("Error getting user location:", error);
            setUserLocation(defaultCenter);
            fetchNearbyPlaces(defaultCenter, keywords);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setUserLocation(defaultCenter);
        fetchNearbyPlaces(defaultCenter, keywords);
      }
    }

    // Cleanup the location watcher when the component unmounts
    return () => {
      if (locationWatcher.current) {
        navigator.geolocation.clearWatch(locationWatcher.current);
      }
    };
  }, [category, fetchNearbyPlaces, isLoaded, lastFetchedLocation]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation || center || defaultCenter}
      zoom={14}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      )}
      {nearbyResources.map((resource, index) => (
        <Marker
          key={index}
          position={{ lat: resource.lat, lng: resource.lng }}
          onClick={() => setSelectedMarker(resource)}
          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        />
      ))}
      {selectedMarker && (
        <InfoWindow
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div>
            <h3>{selectedMarker.name}</h3>
            <p>{selectedMarker.address}</p>
            <p>
              <strong>Phone:</strong> {selectedMarker.phone}
            </p>
            <p>
              <strong>Status:</strong> {selectedMarker.status}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Googlemap;
