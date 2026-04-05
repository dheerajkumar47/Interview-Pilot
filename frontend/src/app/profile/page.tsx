"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    experienceLevel: "fresher",
    targetRole: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        experienceLevel: user.experienceLevel || "fresher",
        targetRole: "", // We need to fetch this from 'profiles' table
      });

      // Fetch additional profile data
      const fetchProfile = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data && !error) {
          setProfile({
            fullName: data.full_name || user.fullName || "",
            experienceLevel: data.experience_level || "fresher",
            targetRole: data.target_role || "",
          });
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !supabase) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profile.fullName,
          experience_level: profile.experienceLevel,
          target_role: profile.targetRole,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", animation: "slideUp 0.5s var(--ease-out)" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "var(--space-2)" }}>Profile Settings</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>Manage your account and preferences</p>

      {success && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          ✅ Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          ❌ {error}
        </div>
      )}

      <div className="glass-card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontWeight: 700, marginBottom: "var(--space-5)" }}>Personal Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              className="input" 
              value={profile.fullName} 
              onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input" value={user?.email || ""} disabled />
          </div>
          <div className="input-group">
            <label className="input-label">Experience Level</label>
            <select 
              className="input" 
              value={profile.experienceLevel}
              onChange={(e) => setProfile(prev => ({ ...prev, experienceLevel: e.target.value }))}
            >
              <option value="fresher">Fresher</option>
              <option value="junior">Junior (1-3 yrs)</option>
              <option value="mid">Mid (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Target Role</label>
            <input 
              className="input" 
              placeholder="e.g., Software Engineer" 
              value={profile.targetRole}
              onChange={(e) => setProfile(prev => ({ ...prev, targetRole: e.target.value }))}
            />
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ marginTop: "var(--space-6)" }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="glass-card" style={{ padding: "var(--space-6)" }}>
        <h2 style={{ fontWeight: 700, marginBottom: "var(--space-5)" }}>Interview Preferences</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
          Configure how the AI agents should tailor your practice sessions.
        </p>
        <div className="input-group" style={{ marginBottom: "var(--space-4)" }}>
          <label className="input-label">Primary Skillset</label>
          <input className="input" placeholder="e.g., React, Node.js, Python" />
        </div>
        <button className="btn btn-secondary">Save Preferences</button>
      </div>
    </div>
  );
}
