import React, { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Users, FileText, MessageSquare, Info, Target, Trash2, Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import DocumentList from "../components/DocumentList";
import DiscussionBoard from "../components/DiscussionBoard";
import MilestonesList from "../components/MilestonesList";
import "./ProjectDetail.css";

export default function ProjectDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const { projects, updateProjectStatus, removeMember, isLoadingProjects } = useProject();
    const [activeTab, setActiveTab] = useState("overview"); // overview, documents, discussion, milestones

    if (isLoadingProjects) {
        return <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading project details...</div>;
    }

    const project = projects.find(p => p.id.toString() === id);
    const isAdmin = user?.role === "admin";

    if (!project) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="project-detail-container">
            <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="project-header">
                <div className="header-info">
                    <h1>{project.name}</h1>
                    {isAdmin ? (
                        <select
                            className={`status-badge status-${project.status.toLowerCase()}`}
                            value={project.status}
                            onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                            style={{ cursor: "pointer", border: "1px solid var(--border-color)", padding: "4px 8px" }}
                        >
                            <option value="Planning">Planning</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    ) : (
                        <span className={`status-badge status-${project.status.toLowerCase()}`}>
                            {project.status}
                        </span>
                    )}
                </div>
                <p className="project-desc">{project.description}</p>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Info size={16} /> Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                >
                    <FileText size={16} /> Documents
                </button>
                <button
                    className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('milestones')}
                >
                    <Target size={16} /> Milestones
                </button>
                <button
                    className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('discussion')}
                >
                    <MessageSquare size={16} /> Discussion
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <section className="overview-section">
                            <h3>Admin</h3>
                            <div className="member-list">
                                <div className="member-item">
                                    <div className="member-avatar admin-avatar">A</div>
                                    <span>{project.adminEmail}</span>
                                </div>
                            </div>
                        </section>

                        <section className="overview-section">
                            <h3>Researchers ({project.members.length})</h3>
                            {project.members.length > 0 ? (
                                <div className="member-list">
                                    {project.members.map((email, idx) => (
                                        <div key={idx} className="member-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="member-avatar">R</div>
                                                <span>{email}</span>
                                            </div>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => removeMember(project.id, email)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                                    title="Remove Member"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-text">No researchers have joined yet.</p>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'documents' && <DocumentList project={project} />}
                {activeTab === 'milestones' && <MilestonesList project={project} />}
                {activeTab === 'discussion' && <DiscussionBoard project={project} />}
            </div>
        </div>
    );
}
