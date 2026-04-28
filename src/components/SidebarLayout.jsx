import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Folder, MessageSquare, Settings, User, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./SidebarLayout.css";

export default function SidebarLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="brand-logo">SH</div>
                    <h2>StudentHub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className="nav-item">
                        <Home size={20} />
                        <span>Home</span>
                    </Link>
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/my-projects" className={`nav-item ${location.pathname === '/my-projects' ? 'active' : ''}`}>
                        <Folder size={20} />
                        <span>My Projects</span>
                    </Link>
                    <Link to="/messages" className={`nav-item ${location.pathname === '/messages' ? 'active' : ''}`}>
                        <MessageSquare size={20} />
                        <span>Messages</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Top Navbar */}
                <header className="top-navbar">
                    <div className="breadcrumbs">
                        <span>Pages</span> / <strong>Dashboard</strong>
                    </div>
                    <div className="top-nav-actions">
                        <button className="icon-btn" onClick={() => alert("Settings coming soon!")}><Settings size={20} /></button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
}
