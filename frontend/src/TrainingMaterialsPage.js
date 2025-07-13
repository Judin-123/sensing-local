import React from "react";
import "./VolunteerDashboard.css";

const materials = [
    {
        title: "Safety Protocols Video",
        type: "video",
        url: "#",
        description: "Watch the safety protocols training video.",
        duration: "15 min"
    },
    {
        title: "Audit Methodology Guide",
        type: "pdf",
        url: "#",
        description: "Download the official audit methodology PDF guide.",
        size: "2.5 MB"
    },
    {
        title: "Community Engagement Training",
        type: "external",
        url: "#",
        description: "Access advanced community engagement training online."
    }
];

export default function TrainingMaterialsPage() {
    return (
        <div className="training-materials-page">
            <h2 className="page-title">📚 Training Materials</h2>
            <div className="materials-list">
                {materials.map((mat, idx) => (
                    <div className="material-card" key={idx}>
                        <div className="material-title">{mat.title}</div>
                        <div className="material-desc">{mat.description}</div>
                        <div className="material-meta">
                            {mat.type === "video" && <span>🎬 {mat.duration}</span>}
                            {mat.type === "pdf" && <span>📄 {mat.size}</span>}
                            {mat.type === "external" && <span>🌐 Online</span>}
                        </div>
                        <a
                            className="material-btn"
                            href={mat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {mat.type === "video" ? "Watch" : mat.type === "pdf" ? "Download" : "View"}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
} 