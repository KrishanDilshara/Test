import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, BookOpen, Clock, Shield, Award, Users, PlayCircle, Target } from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <Link to="/" className="home-nav-brand">
          <div className="home-nav-logo-box">
            <GraduationCap fill="#fff" size={22} />
          </div>
          <span className="home-nav-name">
            Edu<span>Nexus</span>
          </span>
        </Link>
        <ul className="home-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it Works</a></li>
          <li><a href="#roles">Roles</a></li>
        </ul>
        <div className="home-nav-btns">
          <Link to="/login" className="btn-outline">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary-home">
            Sign Up <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <header className="home-hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob--1"></div>
          <div className="hero-blob hero-blob--2"></div>
          <div className="hero-blob hero-blob--3"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            EduCore Academics 2.0 is Live
          </div>
          <h1 className="hero-title">
            Master your future with <span className="hero-title-gradient">Smart Study Goals</span>
          </h1>
          <p className="hero-subtitle">
            An intelligent Learning Management System designed to help students, lecturers, and admins seamlessly track academic progress, manage tasks, and climb the leaderboard.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="hero-btn-primary">
              Start Learning Now <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="hero-btn-secondary">
              <PlayCircle size={18} /> Watch Demo
            </Link>
          </div>
        </div>

        {/* ── Hero Preview Dashboard ── */}
        <div className="hero-preview">
          <div className="hero-preview-bar">
            <div className="hero-preview-dot hero-preview-dot--red"></div>
            <div className="hero-preview-dot hero-preview-dot--yellow"></div>
            <div className="hero-preview-dot hero-preview-dot--green"></div>
            <div className="hero-preview-url">educore.app/dashboard</div>
          </div>
          <div className="hero-preview-body">
            <div className="hero-preview-sidebar">
              <div className="preview-nav-item">
                <div className="preview-nav-dot"></div>
                <div className="preview-nav-line" style={{ width: "60%" }}></div>
              </div>
              <div className="preview-nav-item active">
                <div className="preview-nav-dot"></div>
                <div className="preview-nav-line" style={{ width: "80%" }}></div>
              </div>
              <div className="preview-nav-item">
                <div className="preview-nav-dot"></div>
                <div className="preview-nav-line" style={{ width: "40%" }}></div>
              </div>
            </div>
            <div className="hero-preview-main">
              <div className="preview-card">
                <div className="preview-card-num">12</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Active Goals</div>
                <div className="preview-card-bar">
                  <div className="preview-card-fill fill--blue" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="preview-card">
                <div className="preview-card-num">8</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Completed Tasks</div>
                <div className="preview-card-bar">
                  <div className="preview-card-fill fill--green" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div className="preview-card">
                <div className="preview-card-num">3</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Pending Review</div>
                <div className="preview-card-bar">
                  <div className="preview-card-fill fill--amber" style={{ width: "30%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Stats Band ── */}
      <section className="home-stats">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-item-number">10k+</div>
            <div className="stat-item-label">Active Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-number">5M</div>
            <div className="stat-item-label">Goals Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-number">250+</div>
            <div className="stat-item-label">Universities</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-number">4.9/5</div>
            <div className="stat-item-label">Student Rating</div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="home-features">
        <div className="section-badge">Powerful Features</div>
        <h2 className="section-title">Everything you need to succeed.</h2>
        <p className="section-sub">
          EduCore provides a comprehensive suite of tools designed specifically for academic excellence,
          keeping you motivated, organized, and ahead of the curve.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box icon-box--indigo">
              <Target size={24} color="#818cf8" />
            </div>
            <h3 className="feature-title">Smart Goal Tracking</h3>
            <p className="feature-desc">Set priorities, track progress, and manage deadlines securely within your personal academic dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box icon-box--rose">
              <Award size={24} color="#fb7185" />
            </div>
            <h3 className="feature-title">Competitive Leaderboard</h3>
            <p className="feature-desc">Earn points for completed tasks, climb the ranks, and stay motivated through gamified peer competition.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box icon-box--blue">
              <Users size={24} color="#60a5fa" />
            </div>
            <h3 className="feature-title">Role-based Access</h3>
            <p className="feature-desc">Custom experiences tailored perfectly for students, lecturers, and system administrators.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box icon-box--green">
              <Shield size={24} color="#34d399" />
            </div>
            <h3 className="feature-title">Enterprise Security</h3>
            <p className="feature-desc">Encrypted JWT authentication, robust password hashing, and granular backend permissions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box icon-box--amber">
              <Clock size={24} color="#fbbf24" />
            </div>
            <h3 className="feature-title">Real-time Analytics</h3>
            <p className="feature-desc">Stay informed with instant visual metrics, progress bars, and high-level academic overviews.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box icon-box--cyan">
              <BookOpen size={24} color="#22d3ee" />
            </div>
            <h3 className="feature-title">Centralized Management</h3>
            <p className="feature-desc">All your academic goals, peer rankings, and administrative control in one beautiful UI.</p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="home-how">
        <div className="how-inner">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: "60px" }}>Transform your academic journey.</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-emoji">📝</div>
              <h3 className="step-title">Register Account</h3>
              <p className="step-desc">Sign up securely and customize your personal academic profile.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-emoji">🎯</div>
              <h3 className="step-title">Set Goals</h3>
              <p className="step-desc">Create distinct study targets with deadlines and priority levels.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-emoji">📈</div>
              <h3 className="step-title">Track Progress</h3>
              <p className="step-desc">Update your milestones and track completion organically over time.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-emoji">🏆</div>
              <h3 className="step-title">Earn Ranks</h3>
              <p className="step-desc">Reach 100% completion, boost your score, and dominate the leaderboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role specific ── */}
      <section id="roles" className="home-roles">
        <h2 className="section-title">Built for everyone.</h2>
        <p className="section-sub">A platform that adapts to your exact needs, whether you're learning, teaching, or managing.</p>

        <div className="roles-grid">
          <div className="role-card role-card--student">
            <span className="role-icon">👩‍🎓</span>
            <h3 className="role-title">For Students</h3>
            <p className="role-desc">Focus purely on your studies without administrative distractions.</p>
            <div className="role-perms">
              <div className="role-perm"><div className="perm-check perm-check--green">✔</div> Manage personal study goals</div>
              <div className="role-perm"><div className="perm-check perm-check--green">✔</div> Track individual progress metrics</div>
              <div className="role-perm"><div className="perm-check perm-check--green">✔</div> Compete globally on the leaderboard</div>
            </div>
          </div>

          <div className="role-card role-card--lecturer">
            <span className="role-icon">👨‍🏫</span>
            <h3 className="role-title">For Lecturers</h3>
            <p className="role-desc">Monitor student progress and manage academic cohorts effortlessly.</p>
            <div className="role-perms">
              <div className="role-perm"><div className="perm-check perm-check--blue">✔</div> View global student leaderboard</div>
              <div className="role-perm"><div className="perm-check perm-check--blue">✔</div> Search and view student profiles</div>
              <div className="role-perm"><div className="perm-check perm-check--blue">✔</div> Track overall classroom success</div>
            </div>
          </div>

          <div className="role-card role-card--admin">
            <span className="role-icon">🛡️</span>
            <h3 className="role-title">For Admins</h3>
            <p className="role-desc">Full systematic control over users, security, and access rules.</p>
            <div className="role-perms">
              <div className="role-perm"><div className="perm-check perm-check--indigo">✔</div> Edit, update, or remove users</div>
              <div className="role-perm"><div className="perm-check perm-check--indigo">✔</div> Create new lecturer/admin accounts</div>
              <div className="role-perm"><div className="perm-check perm-check--indigo">✔</div> Manage system-wide study goals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="home-cta">
        <div className="cta-card">
          <div className="cta-glow"></div>
          <span className="cta-emoji">🚀</span>
          <h2 className="cta-title">Ready to elevate your academic experience?</h2>
          <p className="cta-sub">
            Join thousands of students and educators who are already using EduCore to manage their academic success.
          </p>
          <div className="cta-btns">
            <Link to="/register" className="hero-btn-primary">
              Create Free Account
            </Link>
            <Link to="/login" className="hero-btn-secondary">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-footer-brand">
          Edu<strong>Core</strong> LMS
        </div>
        <div className="home-footer-copy">
          © {new Date().getFullYear()} EduCore Academic System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
