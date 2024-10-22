import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIcon from "@mui/icons-material/Assignment";

const Placement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resources = [
    { 
      key: "resume", 
      name: "Create Resume", 
      icon: DescriptionIcon, 
      description: "Tips and templates for creating an effective resume",
      link: "/resume-builder"
    },
    { 
      key: "cover-letter", 
      name: "Write Cover Letter", 
      icon: EmailIcon, 
      description: "Guide to writing compelling cover letters",
      link: "/cover-letter"
    },
    { 
      key: "job-search", 
      name: "Job Search Tips", 
      icon: AssignmentIcon, 
      description: "Things to consider while applying for jobs"
    },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsCollection = collection(db, "jobs");
        const jobsSnapshot = await getDocs(jobsCollection);
        const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsList);
        setFilteredJobs(jobsList);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Unable to fetch jobs at this time. Please try again later.");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleApply = (jobId) => {
    // Implement apply functionality here
    console.log(`Applied to job with ID: ${jobId}`);
  };

  const handleResourceClick = (resource) => {
    if (resource.link) {
      navigate(resource.link);
    } else {
      // Handle other resources (e.g., open a modal with information)
      console.log(`Clicked on ${resource.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-lavender-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-lavender-900 text-center mb-8">
          LGBTQIA+ Job Resources
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-lavender-900 bg-lavender-50 border border-lavender-300 rounded-full focus:outline-none focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lavender-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-lavender-900 mb-4">Job Listings</h2>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-lavender-600">Loading job listings...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h3 className="text-xl font-semibold text-lavender-800">{job.title}</h3>
                  <p className="text-lavender-600">{job.company}</p>
                  <p className="text-sm text-lavender-500 mt-2">{job.location}</p>
                  <button
                    onClick={() => handleApply(job.id)}
                    className="mt-4 bg-lavender-600 text-white px-4 py-2 rounded-full hover:bg-lavender-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-lavender-600">No job listings found. Try adjusting your search.</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-lavender-900 mb-4">Resources</h2>
            <div className="grid grid-cols-1 gap-4">
              {resources.map((resource) => (
                <div
                  key={resource.key}
                  onClick={() => handleResourceClick(resource)}
                  className="bg-white rounded-lg shadow-md p-6 border border-lavender-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex items-center">
                    <resource.icon className="text-lavender-600 mr-4" style={{ fontSize: 36 }} />
                    <div>
                      <h3 className="text-lg font-bold mb-1 text-lavender-800">{resource.name}</h3>
                      <p className="text-sm text-lavender-600">{resource.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placement;