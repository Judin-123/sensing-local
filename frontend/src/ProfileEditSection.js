import React, { useState } from "react";
import axios from "axios";

const ProfileEditSection = ({ userProfile, setUserProfile, userData }) => {
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        address: userProfile.address || ""
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const userId = userData?.id || userProfile?.id;
            if (!userId) {
                setError("User ID not found");
                return;
            }
            const res = await axios.put(`http://localhost:5000/api/user/${userId}`, form);
            setUserProfile(res.data.data);
            setEditMode(false);
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (editMode) {
        return (
            <div className="profile-card">
                <h3 className="profile-section-title"><span role="img" aria-label="info">📋</span> Edit Basic Information</h3>
                <div className="profile-basic-info">
                    <div>
                        <b>Name:</b> <input name="name" value={form.name} onChange={handleChange} />
                    </div>
                    <div>
                        <b>Phone:</b> <input name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <b>Ward:</b> <input name="address" value={form.address} onChange={handleChange} />
                    </div>
                    <div>
                        <b>Email:</b> {userProfile.email}
                    </div>
                    <div>
                        <b>Join Date:</b> {userProfile.createdAt ? userProfile.createdAt.substring(0, 10) : "-"}
                    </div>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button onClick={handleSave} disabled={saving} style={{ marginRight: 8 }}>
                    {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditMode(false)} disabled={saving}>Cancel</button>
            </div>
        );
    }
    return (
        <div className="profile-card">
            <h3 className="profile-section-title"><span role="img" aria-label="info">📋</span> Basic Information</h3>
            <div className="profile-basic-info">
                <div><b>Name:</b> {userProfile.name}</div>
                <div><b>Email:</b> {userProfile.email}</div>
                <div><b>Phone:</b> {userProfile.phone || "-"}</div>
                <div><b>Ward:</b> {userProfile.address || userProfile.ward || "-"}</div>
                <div><b>Join Date:</b> {userProfile.createdAt ? userProfile.createdAt.substring(0, 10) : "-"}</div>
            </div>
            <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
    );
};

export default ProfileEditSection;
