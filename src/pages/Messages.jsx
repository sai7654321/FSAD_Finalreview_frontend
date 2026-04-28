import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import "./Messages.css";

export default function Messages() {
    const { projects } = useProject();
    const myProjects = projects;

    return (
        <div className="messages-page-container">
            <div className="messages-header">
                <h1 className="welcome-text">Global Messages</h1>
                <p className="subtitle">Select a project to view its discussion board.</p>
            </div>

            <div className="messages-project-list">
                {myProjects.length > 0 ? (
                    myProjects.map(project => (
                        <div key={project.id} className="message-project-card">
                            <div className="message-project-info">
                                <div className="message-icon-wrapper">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h3>{project.name}</h3>
                                    <p>{project.messages.length} messages in this discussion</p>
                                </div>
                            </div>
                            <Link to={`/project/${project.id}`} className="view-discussion-btn">
                                Open Discussion <ChevronRight size={18} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>You haven't joined any projects yet to participate in discussions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
