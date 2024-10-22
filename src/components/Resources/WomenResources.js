import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import SpaIcon from "@mui/icons-material/Spa";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const categories = [
  { key: "healthcare", name: "Healthcare", icon: LocalHospitalIcon, description: "Women health services and facilities" },
  { key: "mentalhealth", name: "Mental Health", icon: PsychologyIcon, description: "Emotional and psychological support" },
  { key: "legal", name: "Legal Aid", icon: GavelIcon, description: "Legal help for women in need" },
  { key: "safety", name: "Safety", icon: SecurityIcon, description: "Safety resources and emergency contacts" },
  { key: "childcare", name: "Childcare", icon: ChildCareIcon, description: "Childcare and support services" },
  { key: "education", name: "Education", icon: SchoolIcon, description: "Education programs and training" },
  { key: "career", name: "Career", icon: WorkIcon, description: "Career guidance and job support" },
  { key: "financial", name: "Financial", icon: AttachMoneyIcon, description: "Financial advice and grants" },
  { key: "leadership", name: "Leadership", icon: TrendingUpIcon, description: "Leadership programs and events" },
  { key: "wellness", name: "Wellness", icon: SpaIcon, description: "Women's wellness and fitness" },
  { key: "support-groups", name: "Support Groups", icon: GroupIcon, description: "Support groups and community help" },
  { key: "fitness", name: "Fitness", icon: FitnessCenterIcon, description: "Fitness programs and activities" },
  { key: "housing", name: "Housing", icon: HomeIcon, description: "Housing support and shelters" },
  { key: "food-nutrition", name: "Food & Nutrition", icon: RestaurantIcon, description: "Food security and nutrition advice" },
];

const WomenResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    navigate(`/women-resources/${category.key}`);
  };

  return (
    <div className="min-h-screen bg-lavender-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-lavender-900 text-center mb-8">
          Women Resources
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

export default WomenResources;