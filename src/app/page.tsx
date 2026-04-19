"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "94.4%", label: "Model Accuracy" },
  { value: "6,819", label: "Companies Trained" },
  { value: "<2s", label: "Score Generation" },
  { value: "4", label: "Risk Dimensions" },
];

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Multi-Factor Scoring",
    desc: "Liquidity ratios, debt coverage, revenue growth, and expense volatility fused into one composite health score.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Bankruptcy Risk Detection",
    desc: "Altman Z-Score integration flags distress signals before they become irreversible — weeks ahead of manual review.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Explainable AI",
    desc: "Every score comes with factor-level attribution. Understand exactly which metrics drove the evaluation — no black boxes.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant CSV Upload",
    desc: "Drop a balance sheet or P&L statement. Our pipeline normalises inconsistent formats and returns insights in seconds.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    title: "Investment Attractiveness",
    desc: "A standalone investment score surfaces the most fundable SMEs — helping capital allocators prioritise with confidence.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Adaptive to SME Structures",
    desc: "Trained on diverse company profiles — retail, manufacturing, services — the model adapts to non-standard reporting.",
  },
];

const STEPS = [
  { step: "01", title: "Upload Financials", desc: "CSV export from your accounting tool — balance sheet & P&L." },
  { step: "02", title: "AI Extraction", desc: "Our model parses 40+ financial indicators in under two seconds." },
  { step: "03", title: "Score & Explain", desc: "Receive a composite health score with factor-level attribution." },
  { step: "04", title: "Act on Insights", desc: "Export reports, flag risks, and rank investment candidates." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#080c14", color: "#e8eaf0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh" }}>

      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-glass {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.3s, border-color 0.3s;
        }
        .nav-glass.scrolled {
          background: rgba(8, 12, 20, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .score-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(100,180,255,0.2);
          transform: translateY(-2px);
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }

        .step-line::after {
          content: '';
          position: absolute;
          top: 20px;
          left: calc(50% + 20px);
          width: calc(100% - 40px);
          height: 1px;
          background: linear-gradient(90deg, rgba(100,180,255,0.3), rgba(100,180,255,0.05));
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #1a6fff, #0d4fd4);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #a0aec0;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); color: #e8eaf0; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(26,111,255,0.12);
          border: 1px solid rgba(26,111,255,0.25);
          color: #6eb4ff;
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .section { padding: 100px 24px; }
        .section-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 300;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .section-title strong { font-weight: 600; color: #fff; }
        .section-subtitle { color: #718096; font-size: 17px; line-height: 1.7; max-width: 540px; }

        .highlight { color: #6eb4ff; }

        .footer-link { color: #4a5568; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .footer-link:hover { color: #a0aec0; }

        @media (max-width: 768px) {
          .hero-ctas { flex-direction: column; align-items: stretch; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav-glass${scrolled ? " scrolled" : ""}`}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a6fff" fillOpacity="0.15" />
              <path d="M8 22l6-8 4 5 3-4 5 7" stroke="#6eb4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="10" r="3" fill="#1a6fff" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 20, color: "#e8eaf0", letterSpacing: "-0.01em" }}>FinScore<span style={{ color: "#6eb4ff" }}>AI</span></span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/auth" className="btn-ghost" style={{ padding: "8px 20px", fontSize: 14 }}>
              Log in
            </Link>
            <Link href="/auth?mode=signup" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="grid-bg" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, overflow: "hidden", isolation: "isolate" }}>
        {/* Glow orbs */}
        <div className="glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(26,111,255,0.15) 0%, transparent 70%)", top: "10%", left: "60%" }} />
        <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(100,180,255,0.08) 0%, transparent 70%)", top: "50%", left: "20%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%" }}>
          {/* Left */}
          <div>
            <div className="badge" style={{ marginBottom: 28 }}>
              <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#6eb4ff" /></svg>
              PS-9 · AI Financial Health Scoring
            </div>

            <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, color: "#e8eaf0" }}>
              Know which SMEs<br />
              <strong style={{ fontWeight: 700, color: "#fff" }}>are worth<br />
              the risk.</strong>
            </h1>

            <p style={{ color: "#718096", fontSize: 18, lineHeight: 1.75, marginBottom: 40, maxWidth: 460 }}>
              Upload a balance sheet. Get a composite financial health score, bankruptcy probability, and investment attractiveness rating — in under two seconds.
            </p>

            <div className="hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/auth?mode=signup" className="btn-primary">
                Start free analysis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/auth" className="btn-ghost">
                Log in to dashboard
              </Link>
            </div>

            <p style={{ color: "#4a5568", fontSize: 13, marginTop: 20 }}>No credit card required · CSV upload ready</p>
          </div>

          {/* Right — Score Card Visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: 340, height: 380 }}>
              {/* Main card */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, position: "relative", zIndex: 2, backdropFilter: "blur(12px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <p style={{ color: "#718096", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Financial Health Score</p>
                    <p style={{ color: "#718096", fontSize: 13 }}>Acme Manufacturing Ltd.</p>
                  </div>
                  <span style={{ background: "rgba(72,199,142,0.15)", color: "#48c78e", border: "1px solid rgba(72,199,142,0.25)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 500 }}>Healthy</span>
                </div>

                {/* Score ring + Z-Score side by side */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 28 }}>
                  <div className="score-ring" style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
                    <svg width="100" height="100" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1a6fff" strokeWidth="8"
                        strokeDasharray="251" strokeDashoffset="63"
                        strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono', monospace" }}>75</span>
                      <span style={{ fontSize: 10, color: "#718096" }}>/ 100</span>
                    </div>
                  </div>

                  {/* Z-Score inline block */}
                  <div style={{ background: "rgba(26,111,255,0.1)", border: "1px solid rgba(26,111,255,0.2)", borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
                    <p style={{ fontSize: 11, color: "#6eb4ff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Altman Z-Score</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>3.24</p>
                    <p style={{ fontSize: 11, color: "#48c78e", marginTop: 4 }}>Safe zone</p>
                  </div>
                </div>

                {/* Metric bars */}
                {[
                  { label: "Liquidity", val: 82, color: "#48c78e" },
                  { label: "Debt Ratio", val: 61, color: "#6eb4ff" },
                  { label: "Revenue Growth", val: 74, color: "#9f7aea" },
                  { label: "Expense Volatility", val: 55, color: "#f6ad55" },
                ].map((m) => (
                  <div key={m.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#718096" }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: "#a0aec0", fontFamily: "'DM Mono', monospace" }}>{m.val}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                      <div style={{ height: 4, width: `${m.val}%`, background: m.color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "0 24px 80px", background: "#080c14", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <p style={{ fontSize: 36, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em", marginBottom: 6 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "#718096" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#080c14", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="badge" style={{ marginBottom: 16, display: "inline-flex" }}>Capabilities</p>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Everything analysts need.<br /><strong>Nothing they don't.</strong></h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>Purpose-built for credit analysts, investors, and lenders who need fast, trustworthy SME evaluation.</p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ color: "#6eb4ff", marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8eaf0", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#718096", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0f1a", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="badge" style={{ marginBottom: 16, display: "inline-flex" }}>Workflow</p>
            <h2 className="section-title" style={{ marginBottom: 16 }}>From CSV to insight<br /><strong>in four steps.</strong></h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ position: "relative", textAlign: "center" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 20, left: "calc(50% + 28px)", right: 0, height: 1, background: "linear-gradient(90deg, rgba(26,111,255,0.3), rgba(26,111,255,0.05))" }} />
                )}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(26,111,255,0.12)", border: "1px solid rgba(26,111,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#6eb4ff", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500 }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8eaf0", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#718096", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#080c14", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 20 }}>
            Ready to score your first SME?
          </h2>
          <p style={{ color: "#718096", fontSize: 17, marginBottom: 40 }}>
            Upload a CSV, receive a full financial health report in seconds.
          </p>
          <Link href="/auth?mode=signup" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
            Start for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px", background: "#080c14", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ color: "#4a5568", fontSize: 13 }}>© 2026 FinScoreAI · PS-9 Hackathon Project</span>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="#" className="footer-link">GitHub</a>
            <Link href="/auth" className="footer-link">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}