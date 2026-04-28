import React from "react";
import { Link } from "react-router-dom";
import { Users, FileText, ChevronRight, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
    const { user } = useAuth();
    const { joinProject, deleteProject } = useProject();

    const isMember = (project.members && project.members.includes(user?.email)) || project.adminEmail === user?.email;
    const isAdmin = user?.role === "admin";

    const statusColors = {
        Active: "status-active",
        Planning: "status-planning",
        Completed: "status-completed"
    };

    return (
        <div className="project-card">
            <div className="project-card-header">
                <span className={`status-badge ${statusColors[project.status] || "status-planning"}`}>
                    {project.status}
                </span>
                {isAdmin && (
                    <button
                        onClick={() => deleteProject(project.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete Project"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="project-card-body">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
            </div>

            <div className="project-card-footer">
                <div className="project-stats">
                    <div className="stat">
                        <Users size={16} />
                        <span>{(project.members && project.members.length) || 0}</span>
                    </div>
                    <div className="stat">
                        <FileText size={16} />
                        <span>{(project.documents && project.documents.length) || 0}</span>
                    </div>
                </div>

                {isMember || isAdmin ? (
                    <Link to={`/project/${project.id}`} className="view-link">
                        View Details <ChevronRight size={16} />
                    </Link>
                ) : (
                    <button
                        className="join-btn"
                        onClick={() => joinProject(project.id)}
                    >
                        Join Project
                    </button>
                )}
            </div>
        </div>
    );
}
