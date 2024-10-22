import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import SpaIcon from "@mui/icons-material/Spa";
import ShieldIcon from "@mui/icons-material/Shield";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

const categories = [
  { key: "lgbtq_healthcare", name: "Healthcare", icon: LocalHospitalIcon, description: "Inclusive healthcare services for LGBTQIA+ individuals." },
  { key: "lgbtq_mentalhealth", name: "Mental Health", icon: PsychologyIcon, description: "Emotional and psychological support for LGBTQIA+." },
  { key: "lgbtq_legalaid", name: "Legal Aid", icon: GavelIcon, description: "Legal assistance and resources for LGBTQIA+ rights." },
  { key: "lgbtq_supportgroups", name: "Support Groups", icon: GroupIcon, description: "Community support groups and peer support." },
  { key: "lgbtq_education", name: "Education", icon: SchoolIcon, description: "Educational resources and scholarships for LGBTQIA+." },
  { key: "lgbtq_career", name: "Career", icon: WorkIcon, description: "Career development and job support for LGBTQIA+ professionals." },
  { key: "lgbtq_safety", name: "Safety", icon: ShieldIcon, description: "Resources and support for safety and anti-violence." },
  { key: "lgbtq_leadership", name: "Leadership", icon: SupervisorAccountIcon, description: "Leadership programs and events for LGBTQIA+ individuals." },
  { key: "lgbtq_wellness", name: "Wellness", icon: SpaIcon, description: "Wellness programs and fitness activities for LGBTQIA+." },
];

const LGBTQIA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    navigate(`/lgbtqia-resources/${category.key}`);
  };

  return (
    <div className="min-h-screen bg-lavender-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-lavender-900 text-center mb-8">
          LGBTQIA+ Resources
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-lavender-900 bg-lavender-50 border border-lavender-300 rounded-full focus:outline-none focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lavender-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.key}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-lg shadow-md p-6 border border-lavender-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <category.icon className="text-lavender-600 mb-4" style={{ fontSize: 48 }} />
                <h3 className="text-xl font-bold mb-2 text-lavender-800">{category.name}</h3>
                <p className="text-sm text-lavender-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LGBTQIA;