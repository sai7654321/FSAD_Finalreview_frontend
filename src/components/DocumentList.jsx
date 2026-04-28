import React, { useRef, useState } from "react";
import { Upload, FileText, Download, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import "./DocumentList.css";

export default function DocumentList({ project }) {
    const { user } = useAuth();
    const { addDocument, deleteDocument } = useProject();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const isAdmin = user?.role === "admin";

    // Supported file types for document uploads
    const SUPPORTED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const validateFile = (file) => {
        if (!file) {
            setUploadError("No file selected");
            return false;
        }

        if (!SUPPORTED_TYPES.includes(file.type)) {
            setUploadError("Unsupported file type. Please upload PDF, Word, Excel, or text files.");
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setUploadError("File is too large. Maximum size is 10MB.");
            return false;
        }

        return true;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            uploadFile(file);
        }
    };

    const uploadFile = async (file) => {
        setUploadError(null);
        setUploading(true);
        
        try {
            await addDocument(project.id, file);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            setUploadError(error.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer?.files?.[0];
        if (file && validateFile(file)) {
            uploadFile(file);
        }
    };

    return (
        <div className="document-list-container">
            <div className="document-header">
                <h3>📄 Project Documents</h3>
            </div>

            {uploadError && (
                <div className="upload-error-banner">
                    <AlertCircle size={18} />
                    <span>{uploadError}</span>
                    <button 
                        className="close-error"
                        onClick={() => setUploadError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div
                className={`upload-area ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="upload-content">
                    <Upload size={32} className="upload-icon" />
                    <h4>Upload Documents</h4>
                    <p>Drag and drop your files here or click to browse</p>
                    <p className="file-info">Supported: PDF, Word, Excel, Text (Max 10MB)</p>
                    <button
                        className="upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Select File"}
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    disabled={uploading}
                />
            </div>

            <div className="documents-section">
                <h4>Uploaded Documents</h4>
                <div className="documents-grid">
                    {project.documents && project.documents.length > 0 ? (
                        project.documents.map((doc) => (
                            <div key={doc.id} className="document-card">
                                <div className="doc-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="doc-info">
                                    <h5>{doc.name}</h5>
                                    <p className="doc-meta">
                                        Uploaded by <strong>{doc.uploader}</strong>
                                    </p>
                                    <p className="doc-date">{doc.uploadDate || "Recently"}</p>
                                </div>
                                <div className="doc-actions">
                                    <button 
                                        className="download-btn" 
                                        title="Download Document"
                                        onClick={() => {
                                            // Trigger download (in a real app, this would download the actual file)
                                            console.log(`Download: ${doc.name}`);
                                        }}
                                    >
                                        <Download size={18} />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            className="delete-doc-btn"
                                            title="Delete Document"
                                            onClick={() => {
                                                if (window.confirm(`Delete "${doc.name}"?`)) {
                                                    deleteDocument(project.id, doc.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-docs">
                            <FileText size={48} />
                            <p>No documents found yet.</p>
                            <p>Be the first to upload research materials!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
