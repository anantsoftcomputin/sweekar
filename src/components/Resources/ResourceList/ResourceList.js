import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ResourceCard from "../ResourceCard/ResourceCard";
import Googlemap from "../../GoogleMap/GoogleMap";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@heroicons/react/solid";

const ResourceList = () => {
  const { category } = useParams();

  const itemsPerPage = 9;
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginateResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
          Nearby {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
          Resources
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Googlemap category={category} onResourcesFetched={setResources} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-lavender-900 bg-lavender-50 border border-lavender-300 rounded-full focus:outline-none focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lavender-400" />
          </div>
        </div>

        <div className="mt-6">
          {paginateResources.length > 0 ? (
            <ResourceCard resource={paginateResources} />
          ) : (
            <div className="text-center mt-8">
              <p className="text-xl text-lavender-800">
                {searchTerm
                  ? `No resources found matching "${searchTerm}"`
                  : `No ${category} resources found nearby`}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div
            className={`mt-8 ${
              isMobile
                ? "fixed bottom-0 left-0 right-0 bg-white border-t border-lavender-200 p-2 shadow-md"
                : ""
            }`}
          >
            <PaginationControls />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceList;
