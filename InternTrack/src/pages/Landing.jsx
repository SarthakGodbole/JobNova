import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { motion } from 'framer-motion';
import '../index.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <PublicNavbar />

      <main className="hero-section" style={{ minHeight: '90vh', paddingTop: '10rem' }}>
        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glitch" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.2', marginBottom: '1.2rem' }}
          >
            Track Your Job Applications with JobNova
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-subtitle" style={{ maxWidth: '650px', fontSize: '1.15rem', marginBottom: '2.5rem' }}
          >
            Organize applications, manage deadlines, and track every opportunity in one place.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-actions"
          >
            <Link to="/register" className="btn-primary large" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }}>
              Get Started
            </Link>
            <a href="#how" className="btn-secondary large">
              Explore Features
            </a>
          </motion.div>
        </div>
        

      </main>

      <section id="how" className="features-section" style={{ padding: '5rem 5%' }}>
        <h2 className="section-title">How to Use JobNova</h2>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', maxWidth: '1100px' }}>
          {[
            { step: '1', title: 'Create Account', desc: 'Sign up in seconds and access your dashboard.' },
            { step: '2', title: 'Add Application', desc: 'Enter company, role, deadline, and status.' },
            { step: '3', title: 'Track Progress', desc: 'Move applications through each hiring stage.' },
            { step: '4', title: 'Stay Organized', desc: 'Manage notes, reminders, and follow-ups easily.' }
          ].map((item, i) => (
            <motion.div 
               whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
               className="feature-card" key={i} style={{ padding: '2rem' }}>
               <div style={{ 
                 width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', 
                 color: '#c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.2rem', border: '1px solid rgba(139, 92, 246, 0.3)' 
               }}>
                 {item.step}
               </div>
               <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{item.title}</h3>
               <p style={{ margin: 0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="features-section" style={{ padding: '2rem 5% 6rem' }}>
        <h2 className="section-title">Why Use JobNova?</h2>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {[
            { icon: '👁️', title: 'Visual Tracking', desc: 'See all your applications clearly in one place.' },
            { icon: '📈', title: 'Easy Status Updates', desc: 'Track every stage from applied to offer.' },
            { icon: '📝', title: 'Application Details', desc: 'Store company, role, links, notes, and deadlines.' },
            { icon: '🔔', title: 'Follow-up Reminders', desc: 'Never miss important actions and next steps.' },
            { icon: '📁', title: 'Organized Workflow', desc: 'Manage internship and job search smoothly.' },
            { icon: '🎓', title: 'Student Friendly', desc: 'Simple interface built for students and freshers.' }
          ].map((f, i) => (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
               className="feature-card" key={i}>
              <div className="feature-icon-wrapper" style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>{f.title}</h3>
              <p style={{ margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Landing;
