import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";
import ResourceCard from "../ResourceCard/ResourceCard";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';

const ResourceList = () => {
  const { category } = useParams();
  const itemsPerPage = 9;
  const [mapResources, setMapResources] = useState([]);
  const [webResources, setWebResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchWebResources = useCallback(async () => {
    try {
      const q = query(collection(db, "webResources"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      const resources = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'web'
      }));
      setWebResources(resources);
    } catch (error) {
      console.error("Error fetching web resources:", error);
    }
  }, [category]);

  useEffect(() => {
    fetchWebResources();
  }, [fetchWebResources]);

  const handleMapResourcesFetched = useCallback((resources) => {
    setMapResources(resources.map(resource => ({ ...resource, type: 'map' })));
  }, []);

  useEffect(() => {
    const allResources = [...mapResources, ...webResources];
    const filtered = allResources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResources(filtered);
    setCurrentPage(1);
  }, [searchTerm, mapResources, webResources]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayedResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResourceUpdated = (id, newLikes) => {
    setFilteredResources(prevResources =>
      prevResources.map(resource =>
        resource.id === id ? { ...resource, likes: newLikes } : resource
      )
    );
  };

  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-full bg-lavender-100 text-lavender-600 hover:bg-lavender-200 disabled:opacity-50 transition-colors duration-200"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="text-lavender-800 font-medium">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full bg-lavender-100 text-lavender-600 hover:bg-lavender-200 disabled:opacity-50 transition-colors duration-200"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-lavender-50 p-4 sm:p-6 pb-16 sm:pb-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-lavender-900 text-center mb-8">
          {category.charAt(0).toUpperCase() + category.slice(1)} Resources
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Googlemap category={category} onResourcesFetched={handleMapResourcesFetched} />
        </div>

        <div className={`bg-lavender-50 py-4 ${isMobile ? 'sticky top-0 z-10' : ''}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-2 pl-10 pr-4 text-lavender-900 bg-white border border-lavender-300 rounded-full focus:outline-none focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lavender-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {displayedResources.length > 0 ? (
            displayedResources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                onResourceUpdated={handleResourceUpdated}
              />
            ))
          ) : (
            <div className="col-span-full text-center mt-8">
              <p className="text-xl text-lavender-800">
                {searchTerm
                  ? `No resources found matching "${searchTerm}"`
                  : `No ${category} resources found`}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={`mt-8 ${isMobile ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-lavender-200 p-2 shadow-md' : ''}`}>
            <PaginationControls />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceList;