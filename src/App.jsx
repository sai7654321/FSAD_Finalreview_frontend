import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import MyProjects from "./pages/MyProjects";
import Messages from "./pages/Messages";
import ProjectDetail from "./pages/ProjectDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import SidebarLayout from "./components/SidebarLayout";
import "./App.css";

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-projects" element={<MyProjects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="project/:id" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </AuthProvider>
  );
}