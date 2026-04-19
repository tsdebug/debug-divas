"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "", confirmPassword: "" });

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "forgot") setMode(m as Mode);

    // Show error from callback (e.g. expired link)
    const err = searchParams.get("error");
    if (err === "auth_callback_failed") setError("That link has expired or is invalid. Please try again.");
  }, [searchParams]);

  const supabase = createClient();

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.email.includes("@")) return "Please enter a valid email address.";
    if (mode !== "forgot" && form.password.length < 1) return "Password is required.";
    if (mode === "signup") {
      if (form.name.trim().length < 2) return "Full name is required.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    }

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("An account with this email already exists. Try logging in.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      setSuccess("check_email_signup");
    }

    if (mode === "forgot") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (resetError) console.error("Reset error (hidden from user):", resetError);
      setSuccess("check_email_reset");
    }

    setLoading(false);
  };

  const titles: Record<Mode, string> = {
    login: "Welcome back",
    signup: "Create your account",
    forgot: "Reset your password",
  };
  const subtitles: Record<Mode, string> = {
    login: "Sign in to your FinScoreAI dashboard",
    signup: "Start evaluating SME financial health",
    forgot: "Enter your email and we'll send a reset link",
  };

  const successMessages: Record<string, { title: string; body: string }> = {
    check_email_signup: {
      title: "Check your inbox",
      body: `We sent a confirmation link to ${form.email}. Click it to activate your account.`,
    },
    check_email_reset: {
      title: "Reset link sent",
      body: `If ${form.email} is registered, you'll receive a password reset link shortly.`,
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 13px 16px; font-size: 15px; color: #e8eaf0;
          outline: none; transition: border-color 0.2s, background 0.2s; font-family: inherit;
        }
        .auth-input::placeholder { color: #4a5568; }
        .auth-input:focus { border-color: rgba(26,111,255,0.5); background: rgba(255,255,255,0.06); }

        .auth-btn {
          width: 100%; background: linear-gradient(135deg, #1a6fff, #0d4fd4); color: #fff;
          border: none; border-radius: 10px; padding: 14px; font-size: 15px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .tab-btn {
          flex: 1; background: transparent; border: none; cursor: pointer; padding: 10px;
          font-size: 14px; font-family: inherit; font-weight: 400; border-radius: 8px;
          transition: background 0.2s, color 0.2s; color: #4a5568;
        }
        .tab-btn.active { background: rgba(26,111,255,0.12); color: #6eb4ff; font-weight: 500; }

        .text-link {
          color: #6eb4ff; text-decoration: none; font-size: 14px; transition: color 0.2s;
          background: none; border: none; cursor: pointer; font-family: inherit; padding: 0;
        }
        .text-link:hover { color: #93c5fd; }

        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-box {
          background: rgba(226,75,74,0.1); border: 1px solid rgba(226,75,74,0.25);
          border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #fc8181;
        }
        .success-box {
          background: rgba(72,199,142,0.1); border: 1px solid rgba(72,199,142,0.25);
          border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #48c78e;
        }
        .success-box strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #68d391; }
        .field-label { display: block; font-size: 13px; color: #a0aec0; margin-bottom: 8px; }
      `}</style>

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,111,255,0.1) 0%, transparent 70%)", top: "20%", left: "60%", filter: "blur(80px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
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

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>

          {/* Tabs */}
          {mode !== "forgot" && !success && (
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 32 }}>
              <button className={`tab-btn${mode === "login" ? " active" : ""}`} onClick={() => { setMode("login"); setError(""); setSuccess(null); }}>Log in</button>
              <button className={`tab-btn${mode === "signup" ? " active" : ""}`} onClick={() => { setMode("signup"); setError(""); setSuccess(null); }}>Sign up</button>
            </div>
          )}

          {/* Heading */}
          {!success && (
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>{titles[mode]}</h1>
              <p style={{ fontSize: 14, color: "#718096" }}>{subtitles[mode]}</p>
            </div>
          )}

          {/* Success state */}
          {success ? (
            <div>
              <div className="success-box" style={{ marginBottom: 24 }}>
                <strong>{successMessages[success].title}</strong>
                {successMessages[success].body}
              </div>
              <button className="text-link" onClick={() => { setMode("login"); setSuccess(null); setForm({ email: "", password: "", name: "", confirmPassword: "" }); }}>
                ← Back to log in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {mode === "signup" && (
                <div>
                  <label className="field-label">Full name</label>
                  <input className="auth-input" type="text" placeholder="Alex Johnson" value={form.name} onChange={setField("name")} autoComplete="name" />
                </div>
              )}

              <div>
                <label className="field-label">Email address</label>
                <input className="auth-input" type="email" placeholder="you@company.com" value={form.email} onChange={setField("email")} autoComplete="email" />
              </div>

              {mode !== "forgot" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                    {mode === "login" && (
                      <button type="button" className="text-link" onClick={() => { setMode("forgot"); setError(""); }}>
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input className="auth-input" type="password"
                    placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                    value={form.password} onChange={setField("password")}
                    autoComplete={mode === "login" ? "current-password" : "new-password"} />
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="field-label">Confirm password</label>
                  <input className="auth-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={setField("confirmPassword")} autoComplete="new-password" />
                </div>
              )}

              {error && <div className="error-box">{error}</div>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading
                  ? <><div className="spinner" />{mode === "forgot" ? "Sending..." : mode === "signup" ? "Creating account..." : "Signing in..."}</>
                  : mode === "forgot" ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"
                }
              </button>

              {mode === "forgot" && (
                <div style={{ textAlign: "center" }}>
                  <button type="button" className="text-link" onClick={() => { setMode("login"); setError(""); }}>
                    ← Back to log in
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Bottom links */}
        {!success && mode === "login" && (
          <p style={{ textAlign: "center", color: "#4a5568", fontSize: 14, marginTop: 20 }}>
            Don't have an account?{" "}
            <button className="text-link" onClick={() => { setMode("signup"); setError(""); }}>Sign up free</button>
          </p>
        )}
        {!success && mode === "signup" && (
          <p style={{ textAlign: "center", color: "#4a5568", fontSize: 14, marginTop: 20 }}>
            Already have an account?{" "}
            <button className="text-link" onClick={() => { setMode("login"); setError(""); }}>Log in</button>
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ color: "#4a5568", fontSize: 13, textDecoration: "none" }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#080c14" }} />}>
      <AuthForm />
    </Suspense>
  );
}