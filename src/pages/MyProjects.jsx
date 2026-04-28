import React, { useState } from "react";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { Plus, X, Upload, FileText } from "lucide-react";
import "./MyProjects.css";

export default function MyProjects() {
    const { projects, addProject } = useProject();
    const { user } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Planning"
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Project name is required");
            return;
        }

        setUploading(true);
        try {
            const newProject = await addProject(formData);
            
            if (newProject && selectedFiles.length > 0) {
                for (const file of selectedFiles) {
                    try {
                        await addDocument(newProject.id, file);
                    } catch (fileError) {
                        console.error(`Failed to upload file ${file.name}:`, fileError);
                        // Continue uploading other files even if one fails
                    }
                }
            }

            setFormData({ name: "", description: "", status: "Planning" });
            setSelectedFiles([]);
            setShowCreateModal(false);
        } catch (error) {
            console.error("Failed to create project:", error);
        } finally {
            setUploading(false);
        }
    };

    const canCreateProject = user?.role === "admin";

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="welcome-text">My Projects</h1>
                    <p className="subtitle">All research projects you are currently a part of.</p>
                </div>
                {canCreateProject && (
                    <button
                        className="create-project-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={20} /> Create New Project
                    </button>
                )}
            </div>

            <div className="dashboard-sections">
                <section className="project-section">
                    {projects.length > 0 ? (
                        <div className="projects-grid">
                            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>You aren't part of any projects yet.</p>
                            {canCreateProject && <p>Click "Create New Project" to get started!</p>}
                        </div>
                    )}
                </section>
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Project</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="create-project-form">
                            <div className="form-group">
                                <label htmlFor="name">Project Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter project description"
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Planning">Planning</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="files">Upload Files (Optional)</label>
                                <div className="file-upload-area" onClick={() => document.getElementById('files').click()} style={{ cursor: 'pointer' }}>
                                    <input
                                        type="file"
                                        id="files"
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.pptx,.jpg,.png,.jpeg"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="files" className="file-upload-label">
                                        <Upload size={20} />
                                        Choose Files
                                    </label>
                                    <p className="file-upload-info">
                                        Supported: PDF, Word, Excel, Text, PowerPoint, Images (Max 10MB each)
                                    </p>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="selected-files">
                                        <h4>Selected Files:</h4>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="file-item">
                                                <FileText size={16} />
                                                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="remove-file-btn"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={uploading}
                                >
                                    {uploading ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
