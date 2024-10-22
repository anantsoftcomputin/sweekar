import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
    setIsMenuOpen(false);
    setIsModalOpen(false);
  };

  return (
    <header className="bg-lavender-900 text-lavender-100 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-lavender-200 transition-colors"
          >
            Sweekar
          </Link>
          <nav className="hidden md:flex space-x-6">
            {user && (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/women-resources">Women Resources</NavLink>
                <NavLink to="/lgbtqia-resources">LGBTQIA Resources</NavLink>
                <NavLink to="/placement">Job Resources</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-lavender-200 hover:text-white hover:bg-lavender-700 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-lavender-200 hover:text-white focus:outline-none focus:text-white"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && user && (
        <div className="md:hidden bg-lavender-800">
          <div className="container mx-auto px-4 py-2">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/women-resources"
              onClick={() => setIsMenuOpen(false)}
            >
              Women Resources
            </MobileNavLink>
            <MobileNavLink
              to="/lgbtqia-resources"
              onClick={() => setIsMenuOpen(false)}
            >
              LGBTQIA Resources
            </MobileNavLink>
            <MobileNavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
              Profile
            </MobileNavLink>
            <button
              onClick={() => setIsModalOpen(true)}
              className="block w-full text-left py-2 px-4 text-lavender-200 hover:text-white hover:bg-lavender-700 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lavender-900 text-lg font-bold mb-4">
              Confirm Logout
            </h2>
            <p className="text-lavender-900 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-lavender-900"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-lavender-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`${
        isActive
          ? "text-white bg-lavender-700"
          : "text-lavender-200 hover:text-white hover:bg-lavender-700"
      } px-3 py-1 rounded transition-colors`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block py-2 px-4 ${
        isActive
          ? "text-white bg-lavender-700"
          : "text-lavender-200 hover:text-white hover:bg-lavender-700"
      } rounded transition-colors`}
    >
      {children}
    </Link>
  );
};

export default Header;
