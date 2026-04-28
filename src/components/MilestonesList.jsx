import React, { useState } from "react";
import { CheckCircle, Circle, Plus, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import "./MilestonesList.css";

export default function MilestonesList({ project }) {
    const { user } = useAuth();
    const { addMilestone, updateMilestoneStatus } = useProject();
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");

    const isAdmin = user?.role === "admin";

    // Sort milestones by completion status then date
    const sortedMilestones = [...(project.milestones || [])].sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return a.completed ? 1 : -1;
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (newTitle.trim() && newDate) {
            // Pass raw date string to addMilestone, let it handle formatting
            addMilestone(project.id, { title: newTitle, dueDate: newDate });
            setNewTitle("");
            setNewDate("");
            setIsAdding(false);
        }
    };

    const toggleStatus = (milestoneId, currentStatus) => {
        if (!isAdmin) return;
        updateMilestoneStatus(project.id, milestoneId, !currentStatus);
    };

    return (
        <div className="milestones-container">
            <div className="milestones-header">
                <h2>Project Milestones</h2>
                {isAdmin && (
                    <button className="add-milestone-btn" onClick={() => setIsAdding(!isAdding)}>
                        <Plus size={16} /> Add Milestone
                    </button>
                )}
            </div>

            {isAdding && isAdmin && (
                <form className="add-milestone-form" onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Milestone Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        required
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
                </form>
            )}

            <div className="milestones-list">
                {sortedMilestones.length === 0 ? (
                    <p className="empty-state">No milestones defined yet.</p>
                ) : (
                    sortedMilestones.map(ms => (
                        <div key={ms.id} className={`milestone-item ${ms.completed ? 'completed' : ''}`}>
                            <button
                                className="status-toggle"
                                onClick={() => toggleStatus(ms.id, ms.completed)}
                                disabled={!isAdmin}
                            >
                                {ms.completed ? <CheckCircle className="icon-completed" /> : <Circle className="icon-pending" />}
                            </button>
                            <div className="milestone-details">
                                <span className="milestone-title">{ms.title}</span>
                                <span className="milestone-date">
                                    <Calendar size={12} /> {ms.dueDate}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
