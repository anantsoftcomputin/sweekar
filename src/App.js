import React from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Make sure this is your custom theme

import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import LGBTQIAResources from "./components/Resources/LGBTQIA";
import WomenResources from "./components/Resources/WomenResources";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ResourceList from "./components/Resources/ResourceList/ResourceList";
import ResourceDetail from "./components/Resources/ResourceDetail/ResourceDetail";
import NotFound from "./components/NotFound/NotFound";
import Placement from './components/Placement';
import ResumeBuilder from './components/ResumeBuilder';
import CoverLetterBuilder from "./components/CoverLetterBuilder";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-lavender-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/women-resources"
              element={
                <ProtectedRoute>
                  <WomenResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/women-resources/:category"
              element={
                <ProtectedRoute>
                  <ResourceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lgbtqia-resources"
              element={
                <ProtectedRoute>
                  <LGBTQIAResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lgbtqia-resources/:category"
              element={
                <ProtectedRoute>
                  <ResourceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/:resourceId"
              element={
                <ProtectedRoute>
                  <ResourceDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/placement" element={<Placement />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/cover-letter" element={<CoverLetterBuilder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;