import React from "react";
import "./VolunteerDashboard.css";

const faqs = [
    {
        question: "How do I report an issue during an audit?",
        answer: "Use the emergency contact number provided in your training materials or contact your coordinator directly."
    },
    {
        question: "What should I do if I can't complete an audit?",
        answer: "Notify your coordinator immediately and document the reason. You may be reassigned or the audit can be rescheduled."
    },
    {
        question: "How are my scores calculated?",
        answer: "Scores are based on accuracy, completeness, timeliness, and adherence to safety protocols."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = React.useState(null);
    return (
        <div className="faq-page">
            <h2 className="page-title">❓ Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((faq, idx) => (
                    <div className="faq-card" key={idx}>
                        <button
                            className="faq-question"
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            aria-expanded={openIndex === idx}
                        >
                            {faq.question}
                            <span className="faq-toggle">{openIndex === idx ? "▲" : "▼"}</span>
                        </button>
                        {openIndex === idx && <div className="faq-answer">{faq.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
} 