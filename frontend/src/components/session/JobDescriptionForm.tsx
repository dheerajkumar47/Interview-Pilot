"use client";
import React, { useState } from "react";

interface JobDescriptionFormProps {
  onSubmit: (data: { jobDescription: string; jobTitle: string; company: string; experience: string; roleType: string }) => void;
}

export default function JobDescriptionForm({ onSubmit }: JobDescriptionFormProps) {
  const [jd, setJd] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("");
  const [roleType, setRoleType] = useState("developer");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <textarea
        className="input"
        placeholder="Paste the complete job description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={10}
        style={{ minHeight: 200, resize: "vertical" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <div className="input-group">
          <label className="input-label">Job Title</label>
          <input className="input" placeholder="e.g., Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Company Name</label>
          <input className="input" placeholder="e.g., Google" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Experience Required</label>
          <select className="input" value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="">Select</option>
            <option value="fresher">Fresher (0 years)</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Role Type</label>
          <select className="input" value={roleType} onChange={(e) => setRoleType(e.target.value)}>
            <option value="developer">Developer</option>
            <option value="tester">QA / Tester</option>
            <option value="devops">DevOps / Cloud</option>
            <option value="data">Data / ML</option>
            <option value="design">UI/UX Design</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <button className="btn btn-primary btn-lg" onClick={() => onSubmit({ jobDescription: jd, jobTitle, company, experience, roleType })} disabled={!jd.trim() || !jobTitle}>
        Continue →
      </button>
    </div>
  );
}
