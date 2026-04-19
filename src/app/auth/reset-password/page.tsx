"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 16px; font-size: 15px; color: #e8eaf0; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .auth-input:focus { border-color: rgba(26,111,255,0.5); }
        .auth-input::placeholder { color: #4a5568; }
        .auth-btn { width: 100%; background: linear-gradient(135deg, #1a6fff, #0d4fd4); color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-box { background: rgba(226,75,74,0.1); border: 1px solid rgba(226,75,74,0.25); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #fc8181; }
        .success-box { background: rgba(72,199,142,0.1); border: 1px solid rgba(72,199,142,0.25); border-radius: 8px; padding: 14px 16px; font-size: 14px; color: #48c78e; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a6fff" fillOpacity="0.15" />
              <path d="M8 22l6-8 4 5 3-4 5 7" stroke="#6eb4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="10" r="3" fill="#1a6fff" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 16, color: "#e8eaf0" }}>FinScore<span style={{ color: "#6eb4ff" }}>AI</span></span>
          </Link>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Set new password</h1>
          <p style={{ fontSize: 14, color: "#718096", marginBottom: 28 }}>Choose a strong password for your account.</p>

          {done ? (
            <div className="success-box">
              Password updated! Redirecting you to the dashboard...
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#a0aec0", marginBottom: 8 }}>New password</label>
                <input className="auth-input" type="password" placeholder="Min. 8 characters" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} autoComplete="new-password" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#a0aec0", marginBottom: 8 }}>Confirm password</label>
                <input className="auth-input" type="password" placeholder="Repeat password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(""); }} autoComplete="new-password" />
              </div>
              {error && <div className="error-box">{error}</div>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <><div className="spinner" />Updating...</> : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}