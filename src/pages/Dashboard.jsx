import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import ProjectCard from "../components/ProjectCard";
import "./Dashboard.css";

export default function Dashboard() {
    const { user } = useAuth();
    const { projects, allProjects, addProject } = useProject();
    const [showModal, setShowModal] = useState(false);

    // New Project Form State
    const [newProject, setNewProject] = useState({ name: "", description: "" });

    const myProjects = projects;
    const exploreProjects = allProjects ? allProjects.filter(p => !myProjects.some(mp => mp.id === p.id)) : [];
    const isAdmin = user?.role === "admin";

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (newProject.name.trim() && newProject.description.trim()) {
            addProject(newProject);
            setNewProject({ name: "", description: "" });
            setShowModal(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="welcome-text">Welcome back, {user?.name}</h1>
                    <p className="subtitle">Here's what's happening in your research network.</p>
                </div>
                <button className="create-btn" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </div>

            <div className="dashboard-sections">
                <section className="project-section">
                    <h2 className="section-title">Your Projects</h2>
                    {myProjects.length > 0 ? (
                        <div className="projects-grid">
                            {myProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>You aren't part of any projects yet.</p>
                        </div>
                    )}
                </section>

                {exploreProjects.length > 0 && (
                    <section className="project-section">
                        <h2 className="section-title">Explore Projects</h2>
                        <div className="projects-grid">
                            {exploreProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    </section>
                )}
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Research Project</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="modal-form">
                            <div className="form-group">
                                <label>Project Title</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="e.g. Quantum Computing Materials"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Briefly describe the research goals..."
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
