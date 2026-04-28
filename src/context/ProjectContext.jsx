import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProjects();
        } else {
            setIsLoadingProjects(false);
        }
    }, [user]);

    const fetchProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const response = await fetch("http://localhost:8080/projects");
            if (response.ok) {
                const data = await response.json();
                // Flatten the data to match frontend expectations
                const flattened = data.map(p => ({
                    ...p,
                    adminEmail: p.admin?.email || "",
                    members: (p.members || []).map(m => m.member?.email || ""),
                    documents: p.documents || [],
                    messages: p.messages || [],
                    milestones: p.milestones || []
                }));
                setProjects(flattened);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const addProject = async (projectData) => {
        if (!user) {
            alert("You must be logged in to create a project");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/projects?adminId=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectData),
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error("API Error:", errorData);
                alert(`Failed to create project: ${errorData}`);
                return;
            }
            
            const newProject = await response.json();
            const flattenedProject = {
                ...newProject,
                adminEmail: newProject.admin?.email || "",
                members: (newProject.members || []).map(m => m.member?.email || ""),
                documents: newProject.documents || [],
                messages: newProject.messages || [],
                milestones: newProject.milestones || []
            };
            setProjects(prev => [flattenedProject, ...prev]);
            alert("Project created successfully!");
            return flattenedProject;
        } catch (error) {
            console.error("Failed to add project:", error);
            alert(`Error creating project: ${error.message}`);
            return null;
        }
    };

    const getMyProjects = () => {
        if (!user) return [];
        if (user.role === "admin") {
            return projects;
        }
        // Researchers see projects they are members of or created themselves
        return projects.filter(p => p.members.includes(user.email) || p.adminEmail === user.email);
    };

    const joinProject = async (projectId) => {
        if (!user || user.role !== "researcher") return;
        try {
            await fetch(`http://localhost:8080/projects/${projectId}/join?studentId=${user.id}`, {
                method: "POST",
            });
            fetchProjects(); // Refresh projects
        } catch (error) {
            console.error("Failed to join project:", error);
        }
    };

    const addDocument = async (projectId, file) => {
        if (!user) return;
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("uploader", user.name);

            const response = await fetch(`http://localhost:8080/projects/${projectId}/documents`, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                fetchProjects(); // Refresh projects
            } else {
                const errorData = await response.text();
                throw new Error(errorData);
            }
        } catch (error) {
            console.error("Failed to add document:", error);
            throw error;
        }
    };

    const addMessage = async (projectId, text) => {
        if (!user) return;
        try {
            const message = {
                text,
                sender: user.name
            };
            const response = await fetch(`http://localhost:8080/projects/${projectId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });
            if (response.ok) {
                fetchProjects(); // Refresh projects
            }
        } catch (error) {
            console.error("Failed to add message:", error);
        }
    };

    const deleteProject = async (projectId) => {
        if (!user || user.role !== "admin") return;
        try {
            await fetch(`http://localhost:8080/projects/${projectId}`, {
                method: "DELETE",
            });
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const updateProjectStatus = async (projectId, newStatus) => {
        if (!user || user.role !== "admin") return;
        try {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                const updatedProject = { ...project, status: newStatus };
                const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProject),
                });
                if (response.ok) {
                    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
                }
            }
        } catch (error) {
            console.error("Failed to update project status:", error);
        }
    };

    const addMilestone = async (projectId, milestoneData) => {
        if (!user || user.role !== "admin") return;
        try {
            // Convert date to yyyy-MM-dd format for backend
            const dateObj = new Date(milestoneData.dueDate);
            const formattedDate = dateObj.toISOString().split('T')[0];
            
            const milestone = {
                title: milestoneData.title,
                dueDate: formattedDate,
                completed: false
            };
            const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(milestone),
            });
            if (response.ok) {
                fetchProjects(); // Refresh projects
            }
        } catch (error) {
            console.error("Failed to add milestone:", error);
        }
    };

    const updateMilestoneStatus = async (projectId, milestoneId, completed) => {
        if (!user || user.role !== "admin") return;
        try {
            const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones/${milestoneId}?completed=${completed}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                fetchProjects(); // Refresh projects
            }
        } catch (error) {
            console.error("Failed to update milestone status:", error);
        }
    };

    const deleteDocument = async (projectId, documentId) => {
        if (!user || user.role !== "admin") return;
        try {
            const response = await fetch(`http://localhost:8080/projects/${projectId}/documents/${documentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchProjects(); // Refresh projects
            }
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    const removeMember = async (projectId, memberEmail) => {
        if (!user || user.role !== "admin") return;
        try {
            const response = await fetch(`http://localhost:8080/projects/${projectId}/members?memberEmail=${encodeURIComponent(memberEmail)}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchProjects(); // Refresh projects
            }
        } catch (error) {
            console.error("Failed to remove member:", error);
        }
    };

    return (
        <ProjectContext.Provider value={{
            projects: getMyProjects(),
            allProjects: projects,
            addProject,
            joinProject,
            addDocument,
            addMessage,
            deleteProject,
            updateProjectStatus,
            addMilestone,
            updateMilestoneStatus,
            deleteDocument,
            removeMember,
            isLoadingProjects
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    return useContext(ProjectContext);
}

